import * as ical from 'ical-generator';
import {createHash} from 'crypto';
import centrale from './calendars/centrale';
import ufr from './calendars/ufr';
import {
    Calendar,
    CalendarEvent,
    CalendarId,
    Events,
    Meta,
    Subjects,
    UNKNOWN_SUBJECT
} from "./types";
import {CelcatCalendarType} from "./calendars/celcat";
import CalendarAggregator from './calendars/aggregator';
import {redis} from './redis';

const AGGREGATOR = new CalendarAggregator([ufr], redis);
const VALID_CAT = ['CM', 'TD', 'TP', 'DS'];

function hashSubject(subject: string) {
    return createHash('sha1')
        .update(subject.toUpperCase())
        .digest('hex')
        .substring(0, 10);
}

function getSubjectFromEvent(event: CalendarEvent): { name: string, full_name: string | null, hash: string } {
    return {
        name: event.subject.toUpperCase(),
        full_name: event.full_subject,
        hash: hashSubject(event.subject)
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

export function listOnlineCalendars(type: CelcatCalendarType): Promise<CalendarId[]> {
    return AGGREGATOR.listCalendars(type);
}

export function getOnlineCalendar(id: string): Promise<Calendar> {
    return AGGREGATOR.getCalendar(id);
}

export function getCustomCalendar(fullId: string): Promise<Calendar> {
    return fullId.split('+').reduce((p: Promise<Calendar & { blacklist: string[] }>, id: string) => {
        return p.then(calendar => getOnlineCalendar(id)
            .then(newCalendar => ({
                ...newCalendar,
                events: newCalendar.events.filter(e => calendar.blacklist.indexOf(e.id) === -1)
            }))
            .then(newCalendar => ({
                id: fullId,
                meta: calendar.meta.concat(newCalendar.meta),
                events: calendar.events.concat(newCalendar.events),
                blacklist: calendar.blacklist.concat(newCalendar.events.map(e => e.id)),
                extra: {...calendar.extra, ...newCalendar.extra}
            })));
    }, Promise.resolve({id: '', meta: [], events: [], blacklist: [], extra: {}}))
        .then(res => {
            delete res.blacklist;
            return res;
        });
}

export async function getCalendarFromMeta(metas: Meta[]) {
    return metas.reduce(async (acc: Promise<Calendar>, meta: Meta) => {
        const calendar = await acc;
        const current = await getOnlineCalendar(meta.id);
        const filter = meta.filter || [];
        const events = current.events
            .filter(e => filter.find(s => s === hashSubject(e.subject)) == null &&
                calendar.events.find(ev => ev.id === e.id) == null);
        return {
            ...calendar,
            extra: {...calendar.extra, ...current.extra},
            events: calendar.events.concat(events)
        }
    }, Promise.resolve({meta: metas, events: [], extra: {}}));
}

export function calendarToIcs(events: Events): string {
    let cal = ical({
        domain: 'ec-nantes.fr',
        name: 'EDT',
        prodId: {company: 'ec-nantes.fr', product: 'edt'},
    });
    events.forEach(event => {
        if (event.start && event.end) {
            cal.createEvent({
                start: event.start.tz('UTC').toDate(),
                end: event.end.tz('UTC').toDate(),
                summary: event.pretty,
                description: event.description,
                location: event.location.join(', ')
            });
        }
    });
    return cal.toString();
}