import {Moment, tz} from 'moment-timezone';
import * as ical from 'ical-generator';
import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {parseXmlString, Element} from 'libxmljs';
import {Filter} from './filter';
import {__getSubjectFromEvent, __getSubjects} from "./legacy";

const UNKNOWN_SUBJECT = 'unknown';
const WARN_MESSAGE = "(!) Ce calendrier n'est peut être pas à jour. Les filtres sont désactivés par sécurité."

export type CalendarId = {
    id: string,
    name: string,
    display: string
};

export type CalendarEvent = {
    id: string,
    calendar: string,
    colour: string,
    start: Moment|null,
    end: Moment|null,
    subject: string,
    full_subject: string,
    category: string,
    location: string,
    description: string,
    organizer: string,
    pretty: string
};

export type CalendarType = 'module' | 'group' | 'room' | 'all';

enum Version {
    LATEST = 'version_one',
    UNKNOWN = 'version_unknown',
    ONE = 'version_one',
}

const VERSIONS = [Version.UNKNOWN, Version.ONE];

export type Events = CalendarEvent[];
export type Meta = {
    id: string,
    filter?: number[],
    valid: boolean
};
export type Calendar = {
    id?: string,
    events: Events,
    meta: Meta[],
    version: Version
}

export type Subjects = { id: number, name: string, full_name: string|null, calendar: string, [k: string]: any }[];

const calendarList = (prefix: string|null) => {
    return prefix === 'ufr' ?
        'https://edt.univ-nantes.fr/sciences/finder.xml' :
        'http://website.ec-nantes.fr/sites/edtemps/finder.xml';
};

const calendarUrl = (id: string) => {
    let split = id.split(':');
    let [prefix, _id] = split.length > 1 ? split : [null, id];
    return prefix === 'ufr' ?
        `https://edt.univ-nantes.fr/sciences/${_id}.xml` :
        `http://website.ec-nantes.fr/sites/edtemps/${_id}.xml`;
};

export function listOnlineCalendars(type: CalendarType): Promise<CalendarId[]> {
    return listCalendarsFromSource(null, type)
        .then(calendars => listCalendarsFromSource('ufr', type)
            .then(ufrCalendars => ufrCalendars
                .filter((calendar: CalendarId) => calendar.name.startsWith('M1ECN'))
                .concat(calendars)));
}

export function listCalendarsFromSource(source: string|null, type: CalendarType): Promise<CalendarId[]> {
    return fetch(calendarList(source))
        .then(res => res.text())
        .then(body => parseXmlString(body))
        .then(doc => doc.find('/finder/resource')
            .map(node => {
                let type = node.attr('type').value() as CalendarType;
                return {
                    id: (source ? source + ':' : '') + type[0] + node.attr('id').value(),
                    name: node.get('name'),
                    type: type
                };
            })
            .filter(node => type === 'all' || (node.type === type && node.name != null))
            .map(node => {
                let [name, display] = node.name!.text().split(',');
                return {
                    id: node.id,
                    name: name.trim(),
                    display: (display || name).trim(),
                    type: node.type
                };
            }));
}

export function getIdFromName(name: string): Promise<string | null> {
    return listOnlineCalendars('group')
        .then(calendars => calendars
            .find(cal => cal.name.toLowerCase() === name.toLowerCase()))
        .then(cal => cal == null ? null : cal.id);
}

function safeText(node: Element, xpaths: string[], fallback: string = ''): string {
    let found: string | null = xpaths.reduce((res: string | null, xpath: string) => {
        return (res == null || res.length === 0) ? (node.get(xpath) || {text: () => null}).text() : res;
    }, null);
    return (found || fallback).trim();
}

const ORGANIZER_REGEX = /^([-a-zÀ-ú ]+) \(([-a-zÀ-ú ]+)\)$/i;
const ROOM_REGEX = /^([\w ]+) \(\1\)$/i;
const COURSE_REGEX = /^([\w ]+) \((.*)\)$/i;

type WeekDesc = {
	date: string,
	week: string
}[];

function mapNodeToEvent(node: Element, weeks: WeekDesc, calendar: string): CalendarEvent {

    let id = node.attr('id').value();
    let colour = '#' + node.attr('colour').value();
    let description = safeText(node, ['notes']);
    let organizer = safeText(node, ['resources/staff/item']);
    let res = ORGANIZER_REGEX.exec(organizer);
    if (res != null) {
        organizer = res[2]
    }

    let category = safeText(node, ['category']).replace(' math', '');
    let subject = safeText(node, ['resources/module/item']) || UNKNOWN_SUBJECT;
    let full_subject = subject;
    res = COURSE_REGEX.exec(subject);
    if (res != null) {
        subject = res[1];
        full_subject = res[2];
    }
    let pretty = prettyName(category, full_subject, description);

    let location: string = node.find('resources/room/item')
        .map(n => n.text())
        .map(text => {
            let res = ROOM_REGEX.exec(text);
            return res != null ? res[1] : text;
        })
        .join(', ');

    let day = parseInt(safeText(node, ['day']), 10);
    let week = safeText(node, ['rawweeks']);
    let start = dateFromCourseTime(week, day, safeText(node, ['starttime']), weeks);
    let end = dateFromCourseTime(week, day, safeText(node, ['endtime']), weeks);

    return {
        id,
        colour,
        start,
        end,
        pretty,
        subject: subject.trim(),
        full_subject: full_subject.trim(),
        location,
        description,
        organizer,
        calendar,
        category
    }
}

function prettyName(category: string, full_subject: string, description: string): string {
    let possibleNames = [`${category} ${full_subject === 'unknown' ? '' : full_subject}`, `${description}`]
        .map(s => s.trim())
        .filter(s => s.length > 0);
    return possibleNames.shift() || '';
}

function dateFromCourseTime(week: string, day: number, hour: string, weeks: WeekDesc): Moment|null {
	let match = weeks.find(weekDesc => weekDesc.week === week);
    if (match) {
    	let parsed = tz(`${match.date} ${hour}`, 'DD/MM/YYYY hh:mm', 'Europe/Paris');
    	return parsed.add(day, 'days');
	} else {
		return null;
	}
}

export function getOnlineCalendar(id: string): Promise<Calendar> {
    return fetch(calendarUrl(id))
        .then(res => res.text())
        .then(body => parseXmlString(body))
        .then(doc => {
        	let desc: WeekDesc = doc.find('/timetable/span').map((node: Element) => ({
        		date: node.attr('date').value(),
        		week: node.get('alleventweeks')!.text()
        	}));
            return doc.find('//event')
                .map(node => mapNodeToEvent(node, desc, id))
                .sort((a, b) => a.start && b.start ? a.start.valueOf() - b.start.valueOf() : 0);
        })
        .then(events => ({
            events,
            meta: [{id, valid: true}],
            version: Version.LATEST
        }))
}

const VALID_CAT = ['CM', 'CM math', 'TD', 'TD math', 'TP', 'DS'];

function getSubjectFromEvent(event: CalendarEvent, version: Version = Version.LATEST): {name: string, full_name: string|null} {
    if (version === Version.UNKNOWN) {
        return {
            name: __getSubjectFromEvent(event),
            full_name: null
        };
    }
    return {
        name: event.subject.toUpperCase(),
        full_name: event.full_subject
    };
}

export function getSubjects(calendar: Calendar): Subjects {
    let version = calendar.version;
    if (version === Version.UNKNOWN) {
        return __getSubjects(calendar.events);
    }
    return calendar.events
        .filter(e => e.subject.length > 0)
        .sort((a, b) => a.start && b.start && a.start < b.start ? -1 : 1)
        .reduce((final: Subjects, event) => {
            let subject = getSubjectFromEvent(event, version);
            let isIrrelevant = subject.name === UNKNOWN_SUBJECT.toUpperCase() || VALID_CAT.indexOf(event.category) === -1;
            if (!isIrrelevant) {
                let [exists, len] = final.reduce(([exists, len], actualSub) => {
                    let sameCalendar = actualSub.calendar === event.calendar;
                    let sameSubject = actualSub.name === subject.name;
                    return [
                        exists as boolean || sameSubject && sameCalendar,
                        len as number + (sameCalendar ? 1 : 0)
                    ];
                }, [false, 0]);
                return exists ? final : final.concat([{
                    ...subject,
                    id: len as number,
                    calendar: event.calendar
                }])
            } else {
                return final;
            }
        }, []);
}

function getSingleCustomCalendar(id: string): Promise<Calendar> {
    let [calendarId, filterEnc, checksum, version] = id.split(/[\-_]/);
    if (filterEnc == null) {
        return getOnlineCalendar(calendarId);
    }
    let actualVersion = version == null ? Version.UNKNOWN : VERSIONS[parseInt(version, 10)];
    let filter = Filter.parse(filterEnc);
    return getOnlineCalendar(calendarId)
        .then(cal => {
            let events = cal.events;
            cal.version = actualVersion;
            let subjects = getSubjects(cal);
            let warn = checksum != null && checkSubjects(filter, subjects, checksum);
            events = warn ?
                events.map(event => ({...event, description: event.description + WARN_MESSAGE})) :
                events
                    .filter(event => filter.test((subjects
                        .find(s => s.name === getSubjectFromEvent(event, actualVersion).name) || {id: 999}).id));
            return {
                events,
                meta: [{
                    id: calendarId,
                    filter: subjects.map(s => s.id).filter(s => !filter.test(s)),
                    valid: !warn
                }],
                version: actualVersion
            }
        });
}

export function getCustomCalendar(fullId: string): Promise<Calendar> {
    return fullId.split('+').reduce((p: Promise<Calendar & { blacklist: string[] }>, id: string) => {
        return p.then(calendar => getSingleCustomCalendar(id)
            .then(newCalendar => ({
                ...newCalendar,
                events: newCalendar.events.filter(e => calendar.blacklist.indexOf(e.id) === -1)
            }))
            .then(newCalendar => ({
                id: fullId,
                meta: calendar.meta.concat(newCalendar.meta),
                version: newCalendar.version,
                events: calendar.events.concat(newCalendar.events),
                blacklist: calendar.blacklist.concat(newCalendar.events.map(e => e.id))
            })));
    }, Promise.resolve({id: '', meta: [], events: [], blacklist: [], version: Version.UNKNOWN}))
        .then(res => {
            delete res.blacklist;
            return res;
        });
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

export function createFilter(id: string, indices: number[], subjects: Subjects, version?: Version): string {
    let filter = Filter.from(indices);
    return [id, filter.toString(), makeChecksum(subjects, filter.length()), VERSIONS.indexOf(version || Version.ONE)].join('-');
}

export function createFilterFromMeta(metas: Meta[]): Promise<string> {
    let needFilter = (meta: Meta) => meta.filter != null && meta.filter.length > 0;
    return metas.reduce((p: Promise<string[]>, meta: Meta) => p.then(filters =>
            (needFilter(meta) ?
                getOnlineCalendar(meta.id)
                    .then(cal => createFilter(meta.id, meta.filter!, getSubjects(cal), cal.version)) :
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
            start: event.start ? event.start.tz('UTC').toDate() : null,
            end: event.end ? event.end.tz('UTC').toDate() : null,
            summary: event.pretty,
            description: event.description,
            location: event.location,
            organizer: (event.organizer || 'unknown') + ' ' + '<scolarite@ec-nantes.fr>'
        });
    });
    return cal.toString();
}