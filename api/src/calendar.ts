import {Moment, tz} from 'moment-timezone';
import * as ical from 'ical-generator';
import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {parseXmlString, Element} from 'libxmljs';
import {Filter} from './filter';
import {__getSubjectFromEvent, __getSubjects} from "./legacy";

const FILTER = 'Groupe';
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
    start: Moment,
    end: Moment,
    subject: string,
    full_subject: string,
    category: string,
    location: string,
    description: string,
    organizer: string,
};

export type CalendarType = 'module' | 'group' | 'room';

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
    events: Events,
    meta: Meta[],
    version: Version
}

export type Subjects = { id: number, name: string, calendar: string, [k: string]: any }[];

const calendarList = 'http://website.ec-nantes.fr/sites/edtemps/finder.xml';
const calendarUrl = (id: string) => `http://website.ec-nantes.fr/sites/edtemps/${id}.xml`;

export function listOnlineCalendars(type: CalendarType = 'group'): Promise<CalendarId[]> {
    return fetch(calendarList)
        .then(res => res.text())
        .then(body => parseXmlString(body))
        .then(doc => doc.find('/finder/resource')
            .map(node => {
                let type = node.attr('type').value() as CalendarType;
                return {
                    id: type[0] + node.attr('id').value(),
                    name: node.get('name'),
                    type: type
                };
            })
            .filter(node => node.type === type && node.name != null)
            .map(node => {
                let [name, display] = node.name!.text().split(',');
                return {
                    id: node.id,
                    name: name.trim(),
                    display: (display || name).trim()
                };
            }));
}

export function getIdFromName(name: string): Promise<string | null> {
    return listOnlineCalendars()
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

function mapNodeToEvent(node: Element, weekNumToFirstDay: string[][], calendar: string): CalendarEvent {

    let id = node.attr('id').value();
    let colour = '#' + node.attr('colour').value();
    let day = parseInt(safeText(node, ['day']), 10);
    let week = parseInt(safeText(node, ['prettyweeks']), 10);
    let date = weekNumToFirstDay[week][day];
    let description = safeText(node, ['notes']);
    let organizer = safeText(node, ['resources/staff/item']);
    let res = ORGANIZER_REGEX.exec(organizer);
    if (res != null) {
        organizer = res[2]
    }

    let category = safeText(node, ['category']);
    let subject = safeText(node, ['resources/module/item']).split('-').shift() || 'unknown';
    let full_subject = subject;
    res = COURSE_REGEX.exec(subject);
    if (res != null) {
        subject = res[1];
        full_subject = res[2];
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
        location: location,
        description: description,
        organizer: organizer,
        calendar: calendar,
        category: category
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
            meta: [{id, valid: true}],
            version: Version.LATEST
        }))
}

const VALID_CAT = ['CM', 'TD', 'TP', 'DS'];

function getSubjectFromEvent(event: CalendarEvent, version: Version = Version.LATEST): string {
    if (version === Version.UNKNOWN) {
        return __getSubjectFromEvent(event);
    }
    return event.subject.toUpperCase();
}

export function getSubjects(calendar: Calendar): Subjects {
    let version = calendar.version;
    if (version === Version.UNKNOWN) {
        return __getSubjects(calendar.events);
    }
    return calendar.events
        .filter(e => e.subject.length > 0)
        .sort((a, b) => a.start < b.start ? -1 : 1)
        .reduce((final: Subjects, event) => {
            let subject = getSubjectFromEvent(event, version);
            let isIrrelevant = VALID_CAT.indexOf(event.category) === -1;
            if (!isIrrelevant) {
                let [exists, len] = final.reduce(([exists, len], actualSub) => {
                    let sameCalendar = actualSub.calendar === event.calendar;
                    let sameSubject = actualSub.name === subject;
                    return [
                        exists as boolean || sameSubject && sameCalendar,
                        len as number + (sameCalendar ? 1 : 0)
                    ];
                }, [false, 0]);
                return exists ? final : final.concat([{
                    name: subject,
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
                        .find(s => s.name === getSubjectFromEvent(event, actualVersion)) || {id: 999}).id));
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

export function getCustomCalendar(id: string): Promise<Calendar> {
    return id.split('+').reduce((p: Promise<Calendar & { blacklist: string[] }>, id: string) => {
        return p.then(calendar => getSingleCustomCalendar(id)
            .then(newCalendar => ({
                ...newCalendar,
                events: newCalendar.events.filter(e => calendar.blacklist.indexOf(e.id) === -1)
            }))
            .then(newCalendar => ({
                meta: calendar.meta.concat(newCalendar.meta),
                version: newCalendar.version,
                events: calendar.events.concat(newCalendar.events),
                blacklist: calendar.blacklist.concat(newCalendar.events.map(e => e.id))
            })));
    }, Promise.resolve({meta: [], events: [], blacklist: [], version: Version.UNKNOWN}))
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
            start: event.start.tz('UTC').toDate(),
            end: event.end.tz('UTC').toDate(),
            summary: (event.category + ' ' + (event.subject === 'unknown' ? '' : event.subject)).trim(),
            description: event.description,
            location: event.location,
            organizer: (event.organizer || 'unknown') + ' ' + '<scolarite@ec-nantes.fr>'
        });
    });
    return cal.toString();
}