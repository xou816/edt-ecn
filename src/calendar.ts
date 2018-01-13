import {Moment, tz} from 'moment-timezone';
import * as ical from 'ical-generator';
import * as request from 'request-promise';
import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {parseXml, Element} from 'libxmljs';
import {Filter} from './filter';

const FILTER = 'Groupe';
const WARN_MESSAGE = "(!) Ce calendrier n'est peut être pas à jour. Les filtres sont désactivés par sécurité."

export type CalendarId = {
	id: string,
	name: string,
	display: string
};

export type CalendarEvent = {
	start: Moment,
	end: Moment,
	subject: string,
	full_subject: string,
	location: string,
	description: string,
	organizer: string
};

export type Calendar = CalendarEvent[];

export type Subjects = {[key: string]: number};

const calendarList = 'http://website.ec-nantes.fr/sites/edtemps/finder.xml';
const calendarUrl = (id: string) => `http://website.ec-nantes.fr/sites/edtemps/${id}.xml`;

export function listOnlineCalendars(letter: string = 'g'): Promise<CalendarId[]> {
	return fetch(calendarList)
		.then(res => res.text())
		.then(body => parseXml(body))
		.then(doc => doc.find('/finder/resource')
			.map(node => ({
				link: node.get('link'),
				names: node.get('names')
			}))
			.filter(node => node.link != null && node.names != null)
			.map(node => {
				let names = node.names!.text().split(',');
				let id = node.link!.attr('href').value().split('.').shift();
				return {
					id: id!,
					name: names[0].trim(),
					display: (names[1] || '').trim()
				};
			}));
}

export function getIdFromName(name: string): Promise<string|null> {
	return listOnlineCalendars()
		.then(calendars => calendars
			.find(cal => cal.name.toLowerCase() === name.toLowerCase()))
		.then(cal => cal == null ? null : cal.id);
}

function safeText(node: Element, xpaths: string[], fallback: string = ''): string {
	let res = fallback;
	let found: string|null = xpaths.reduce((res: string|null, xpath: string) => {
		return res == null ? (node.get(xpath) || {text: () => null}).text() : res;
	}, null);
	return found || fallback; 
}

function mapNodeToEvent(node: Element, weekNumToFirstDay: string[][]): CalendarEvent {

	let day = parseInt(safeText(node, ['day']), 10);
	let week = parseInt(safeText(node, ['prettyweeks']), 10);
	let date = weekNumToFirstDay[week][day];
	let description = safeText(node, ['notes']);
	let organizer = safeText(node, ['resources/staff/item']).split(' ').shift() || '';
	
	const reg = /(\w+) \(\1\)/i;

	let subject = safeText(node, ['resources/module/item', 'notes']).split('-').shift() || '';
	if (reg.test(subject)) {
		subject = subject.split(' ').shift()!;
	}
	let cat = safeText(node, ['category']);
	let full_subject = cat + ' ' + subject;

	let location = safeText(node, ['resources/room/item']);
	if (reg.test(location)) {
		location = location.split(' ').shift()!;
	}

	return {
		start: dateFromCourseTime(date, safeText(node, ['starttime'])),
		end: dateFromCourseTime(date, safeText(node, ['endtime'])),
		subject: subject.trim(),
		full_subject: full_subject.trim(),
		location: location,
		description: description,
		organizer: organizer
	}
}

function dateFromCourseTime(date: string, hour: string) {
	return moment.tz(`${date} ${hour}`, 'DD/MM/YYYY hh:mm', 'Europe/Paris');
}

export function getOnlineCalendar(id: string): Promise<Calendar> {
	return fetch(calendarUrl(id))
		.then(res => res.text())
		.then(body => parseXml(body))
		.then(doc => {
			let dates: string[][] = doc.find('/timetable/span').reduce((acc: string[][], node: Element) => {
				let index = parseInt((node.get('title') || {text: () => ''}).text(), 10);
				acc[index] = node.find('day/date').map(date => date.text());
				return acc;
			}, []);
			return doc.find('//event')
				.map(node => mapNodeToEvent(node, dates))
				.sort((a, b) => a.start.valueOf() - b.start.valueOf());
		});
}

export function getSubjects(events: Calendar): Subjects {
	return events
		.map(e => ({ subject: e.subject, date: e.start })) // todo improve double sort
		.sort((a, b) => {
			let bool = a.subject < b.subject || a.subject == b.subject && a.date < b.date
			return bool ? -1 : 1;
		})
		.filter((e, pos, arr) => (e.subject.length && (!pos || e.subject != arr[pos - 1].subject)))
		.sort((a, b) => (a.date < b.date ? -1 : 1))
		.reduce((final, e, index) => ({
			...final,
			[e.subject]: index
		}), {});
}

function getSingleCustomCalendar(id: string): Promise<Calendar> {
	let [calid, filter_withsum] = id.split('-');
	if (filter_withsum == null) {
		return getOnlineCalendar(calid);
	}
	let [filter_enc, checksum] = filter_withsum.split('_');
	let filter = Filter.parse(filter_enc);
	return getOnlineCalendar(calid)
		.then(events => {
			let subjects = getSubjects(events);
			let warn = checksum != null && checkSubjects(filter, subjects, checksum);
			return warn ? 
				events.map(event => ({...event, description: event.description + WARN_MESSAGE})) : 
				events.filter(event => filter.test(subjects[event.subject]));
		});
};

export function getCustomCalendar(id: string): Promise<Calendar> {
	return Promise.all(id.split('+').map(getSingleCustomCalendar))
		.then(all => all.reduce((acc, events) => acc.concat(events), []));
}

function makeChecksum(subjects: Subjects, length: number): string {
	let str = Object.keys(subjects).slice(0, length).join(',');
	return createHash('sha1').update(str).digest('hex').substr(0, 6);
}

function checkSubjects(filter: Filter, subjects: Subjects, checksum: string): boolean {
	let length;
	if (checksum.indexOf('l') > -1) { // old checksum format!
		let [l, c] = checksum.split('l');
		length = parseInt(l, 10);
		checksum = c;
	} else {
		length = filter.length();
	}
	return checksum !== makeChecksum(subjects, length);
}

export function createFilter(id: string, indices: number[], subjects: Subjects): string {
	let filter = Filter.from(indices);
	return id + '-' + filter.toString() + '_' + makeChecksum(subjects, filter.length());
}

export function calendarToIcs(events: Calendar): string {
	let cal = ical({
        domain: 'ec-nantes.fr',
        name: 'EDT',
        timezone: 'Europe/Paris',
        prodId: {company: 'ec-nantes.fr', product: 'edt'},
    });
	events.forEach(event => {
		cal.createEvent({
			start: event.start.tz('UTC').toDate(),
			end: event.end.tz('UTC').toDate(),
			summary: event.full_subject,
			description: event.description,
			location: event.location,
			// organizer: {
			// 	name: event.organizer,
			// 	email: ''
			// }
		});
    });
    return cal.toString();
};