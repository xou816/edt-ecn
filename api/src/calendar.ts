import * as ical from 'ical-generator';
import {createHash} from 'crypto';
import {Filter} from './filter';
import centrale from './calendars/centrale';
import ufr from './calendars/ufr';
import {Calendar, CalendarEvent, CalendarId, Events, Meta, Subjects, UNKNOWN_SUBJECT} from "./types";
import {CelcatCalendarType} from "./calendars/celcat";

const CALENDARS = [ufr, centrale];

const WARN_MESSAGE = "(!) Ce calendrier n'est peut être pas à jour. Les filtres sont désactivés par sécurité."

export function listOnlineCalendars(type: CelcatCalendarType): Promise<CalendarId[]> {
    return Promise.all(CALENDARS.map(celcat => celcat.listCalendars(type)))
        .then(([eva, evb]) => eva.concat(evb));
}

const VALID_CAT = ['CM', 'TD', 'TP', 'DS'];

function getSubjectFromEvent(event: CalendarEvent): { name: string, full_name: string | null } {
    return {
        name: event.subject.toUpperCase(),
        full_name: event.full_subject
    };
}

export function getSubjects(calendar: Calendar): Subjects {
    return calendar.events
        .filter(e => e.subject.length > 0)
        .sort((a, b) => a.start && b.start && a.start < b.start ? -1 : 1)
        .reduce((final: Subjects, event) => {
            let subject = getSubjectFromEvent(event);
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

export function getOnlineCalendar(id: string): Promise<Calendar> {
    return CALENDARS.find(celcat => celcat.hasCalendar(id))!.getCalendar(id);
}

function getSingleCustomCalendar(id: string): Promise<Calendar> {
    let [calendarId, filterEnc, checksum, version] = id.split(/[\-_]/);
    if (filterEnc == null) {
        return getOnlineCalendar(calendarId);
    }
    let filter = Filter.parse(filterEnc);
    return getOnlineCalendar(calendarId)
        .then(cal => {
            let events = cal.events;
            let subjects = getSubjects(cal);
            let warn = checksum != null && checkSubjects(filter, subjects, checksum);
            events = warn ?
                events.map(event => ({...event, description: event.description + WARN_MESSAGE})) :
                events
                    .filter(event => filter.test((subjects
                        .find(s => s.name === getSubjectFromEvent(event).name) || {id: 999}).id));
            return {
                events,
                meta: [{
                    id: calendarId,
                    filter: subjects.map(s => s.id).filter(s => !filter.test(s)),
                    valid: !warn
                }]
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
                events: calendar.events.concat(newCalendar.events),
                blacklist: calendar.blacklist.concat(newCalendar.events.map(e => e.id))
            })));
    }, Promise.resolve({id: '', meta: [], events: [], blacklist: []}))
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
    const length = filter.length();
    return checksum !== makeChecksum(subjects, length);
}

export function createFilter(id: string, indices: number[], subjects: Subjects): string {
    let filter = Filter.from(indices);
    return [id, filter.toString(), makeChecksum(subjects, filter.length())].join('-');
}

export function createFilterFromMeta(metas: Meta[]): Promise<string> {
    let needFilter = (meta: Meta) => meta.filter != null && meta.filter.length > 0;
    return metas.reduce((p: Promise<string[]>, meta: Meta) => p.then(filters =>
            (needFilter(meta) ?
                getOnlineCalendar(meta.id)
                    .then(cal => createFilter(meta.id, meta.filter!, getSubjects(cal))) :
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
            location: event.location.join(', ')
        });
    });
    return cal.toString();
}