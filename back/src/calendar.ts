import {Moment, tz} from 'moment-timezone';
import * as ical from 'ical-generator';
import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {parseXmlString, Element} from 'libxmljs';
import {Filter} from './filter';

const FILTER = 'Groupe';
const WARN_MESSAGE = "(!) Ce calendrier n'est peut être pas à jour. Les filtres sont désactivés par sécurité."

export type CalendarId = {
	id: string,
	name: string,
	display: string
};

export type CalendarEvent = {
	id: string,
	colour: string,
	start: Moment,
	end: Moment,
	subject: string,
	full_subject: string,
	raw_subject: string,
	location: string,
	description: string,
	organizer: string,
	calendar: string
};

export type Events = CalendarEvent[];
export type Meta = {id: string, filter?: number[]};
export type Calendar = {
	events: Events,
	meta: Meta[]
}

export type Subjects = {id: number, name: string}[];

const calendarList = 'http://website.ec-nantes.fr/sites/edtemps/finder.xml';
const calendarUrl = (id: string) => `http://website.ec-nantes.fr/sites/edtemps/${id}.xml`;

export function listOnlineCalendars(letter: string = 'g'): Promise<CalendarId[]> {
	return fetch(calendarList)
		.then(res => res.text())
		.then(body => parseXmlString(body))
		.then(doc => doc.find('/finder/resource')
			.map(node => ({
				link: node.get('link'),
				name: node.get('name')
			}))
			.filter(node => node.link != null && node.name != null)
			.map(node => ({
				name: node.name!.text().split(','),
				id: node.link!.attr('href').value().split('.').shift() || ''
			}))
			.filter(node => node.id[0] === letter)
			.map(node => {
				return {
					id: node.id,
					name: node.name[0].trim(),
					display: (node.name[1] || '').trim()
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
	let found: string|null = xpaths.reduce((res: string|null, xpath: string) => {
		return (res == null || res.length === 0) ? (node.get(xpath) || {text: () => null}).text() : res;
	}, null);
	return (found || fallback).trim();
}

const ORGANIZER_REGEX = /^([-a-zÀ-ú ]+) \(([-a-zÀ-ú ]+)\)$/i;
const ROOM_REGEX = /^([\w ]+) \(\1\)$/i;
const COURSE_REGEX = /^([\w ]+) \((.*)\)$/i;

function mapNodeToEvent(node: Element, weekNumToFirstDay: string[][], calendar: string): CalendarEvent {

	let id = node.attr('id').value();
	let colour = '#'+node.attr('colour').value();
	let day = parseInt(safeText(node, ['day']), 10);
	let week = parseInt(safeText(node, ['prettyweeks']), 10);
	let date = weekNumToFirstDay[week][day];
	let description = safeText(node, ['notes']);
	let organizer = safeText(node, ['resources/staff/item']);
	let res = ORGANIZER_REGEX.exec(organizer);
	if (res != null) {
        organizer = res[2]
    }

    let cat = safeText(node, ['category']);
    let raw_subject = safeText(node, ['resources/module/item', 'notes']).split('-').shift() || '';
    let subject = raw_subject;
    let full_subject = cat + ' ' + raw_subject;
    res = COURSE_REGEX.exec(subject);
    if (res != null) {
        subject = res[2];
        full_subject = cat + ' ' + res[1];
    }

	let location: string = node.find('resources/room/item')
		.map(n => n.text())
		.map(text => {
			let res = ROOM_REGEX.exec(text);
			return res != null ? res[1] : text;
		})
		.join(', ');

	return {
        id: id,
        colour: colour,
		start: dateFromCourseTime(date, safeText(node, ['starttime'])),
		end: dateFromCourseTime(date, safeText(node, ['endtime'])),
		subject: subject.trim(),
		full_subject: full_subject.trim(),
		raw_subject: raw_subject.trim(),
		location: location,
		description: description,
		organizer: organizer,
		calendar: calendar
	}
}

function dateFromCourseTime(date: string, hour: string): Moment {
	return tz(`${date} ${hour}`, 'DD/MM/YYYY hh:mm', 'Europe/Paris');
}

export function getOnlineCalendar(id: string): Promise<Calendar> {
	return fetch(calendarUrl(id))
		.then(res => res.text())
		.then(body => parseXmlString(body))
		.then(doc => {
			let dates: string[][] = doc.find('/timetable/span').reduce((acc: string[][], node: Element) => {
				let index = parseInt((node.get('title') || {text: () => ''}).text(), 10);
				acc[index] = node.find('day/date').map(date => date.text());
				return acc;
			}, []);
			return doc.find('//event')
				.map(node => mapNodeToEvent(node, dates, id))
				.sort((a, b) => a.start.valueOf() - b.start.valueOf());
		})
		.then(events => ({
			events,
			meta: [{id}]
		}))
}

export function getSubjects(events: Events): Subjects {
	return events
		.filter(e => e.subject.length > 0)
		.map(e => ({ subject: e.raw_subject, date: e.start }))
		.sort((a, b) => a.date < b.date ? -1 : 1)
		.reduce((final: Subjects, event) => {
			let exists = final.find(e => e.name === event.subject) != null;
			return final.concat(exists ? [] : [{
				name: event.subject,
				id: final.length
			}])
		}, []);
}

function getSingleCustomCalendar(id: string): Promise<Calendar> {
	let [calid, filter_withsum] = id.split('-');
	if (filter_withsum == null) {
		return getOnlineCalendar(calid);
	}
	let [filter_enc, checksum] = filter_withsum.split('_');
	let filter = Filter.parse(filter_enc);
	return getOnlineCalendar(calid)
		.then(cal => {
			let events = cal.events;
			let subjects = getSubjects(events);
			let warn = checksum != null && checkSubjects(filter, subjects, checksum);
			events = warn ?
				events.map(event => ({...event, description: event.description + WARN_MESSAGE})) :
				events.filter(event => filter.test((subjects
					.find(s => s.name === event.raw_subject) || {id: -1}).id));
			return {
				events,
                meta: [{
					id: calid,
					filter: subjects.map(s => s.id).filter(s => !filter.test(s))
				}]
			}
		});
}

export function getCustomCalendar(id: string): Promise<Calendar> {
    return id.split('+').reduce((p: Promise<Calendar & {blacklist: string[]}>, id: string) => {
    	return p.then(calendar => getSingleCustomCalendar(id)
			.then(newCalendar => ({...newCalendar, events: newCalendar.events.filter(e => calendar.blacklist.indexOf(e.id) === -1)}))
			.then(newCalendar => ({
				meta: calendar.meta.concat(newCalendar.meta),
				events: calendar.events.concat(newCalendar.events),
				blacklist: calendar.blacklist.concat(newCalendar.events.map(e => e.id))
			})));
	}, Promise.resolve({meta: [], events: [], blacklist: []}))
		.then(res => ({meta: res.meta, events: res.events}));
}

function makeChecksum(subjects: Subjects, length: number): string {
	let str = subjects.map(s => s.name).slice(0, length).join(',');
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

export function createFilterFromMeta(metas: Meta[]): Promise<string> {
	let needFilter = (meta: Meta) => meta.filter != null && meta.filter.length > 0;
	return metas.reduce((p: Promise<string[]>, meta: Meta) => p.then(filters =>
		(needFilter(meta) ?
			getOnlineCalendar(meta.id)
				.then(cal => createFilter(meta.id, meta.filter!, getSubjects(cal.events))) :
			Promise.resolve(meta.id))
			.then((f: string) => filters.concat([f]))),
        Promise.resolve([]))
        .then((filters: string[]) => filters.join('+'));
}

export function calendarToIcs(events: Events): string {
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
}