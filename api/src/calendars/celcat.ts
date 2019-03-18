import fetch from "node-fetch";
import {Element, parseXmlString} from "libxmljs";
import {UNKNOWN_SUBJECT} from "../types";
import {Moment, tz} from 'moment-timezone';
import {Calendar, CalendarEvent, CalendarId} from "../types";

type CelcatWeekDesc = {
    date: string,
    week: string
}[];

type CelcatDetails = 'id'|'calendar'|'colour'|'start'|'end'|'subject'|'location'|'description'|'organizer'|'category';

export type CelcatEvent = Pick<CalendarEvent, CelcatDetails>;

export type CelcatCalendarType = 'module' | 'group' | 'room' | 'all';

export abstract class CelcatCalendar {

    abstract prefix(): string;
    abstract url(): string;
    abstract mapCalendarName(name: string): {name: string, display: string};
    abstract mapEvent(event: CelcatEvent): CalendarEvent;
    abstract filterCalendars(calendar: CalendarId): boolean;
    abstract timezone(): string;

    hasCalendar(id: string): boolean {
        return id.startsWith(this.prefix());
    }

    listCalendars(type: CelcatCalendarType): Promise<CalendarId[]> {
        return fetch(this.finderUrl())
            .then(res => res.text())
            .then(body => parseXmlString(body))
            .then(doc => doc.find('/finder/resource')
                .map(node => {
                    let get = nodeGetAttr(node);
                    let type = get('type', 'all') as CelcatCalendarType;
                    return {
                        id: this.prefix() + type[0] + get('id'),
                        name: node.get('name'),
                        type: type
                    };
                })
                .filter(node => (type === 'all' || node.type === type) && node.name != null)
                .map(node => {
                    let {name, display} = this.mapCalendarName(node.name!.text());
                    return {
                        id: node.id,
                        type: node.type,
                        name,
                        display
                    };
                })
                .filter(this.filterCalendars));
    }


    getCalendar(id: string): Promise<Calendar> {
        return fetch(this.calendarUrl(id))
            .then(res => res.text())
            .then(body => parseXmlString(body))
            .then(doc => {
                let desc: CelcatWeekDesc = doc.find('/timetable/span').map((node: Element) => ({
                    date: nodeGetAttr(node)('date'),
                    week: node.get('alleventweeks')!.text()
                }));
                return doc.find('//event')
                    .reduce((list: CalendarEvent[], node) => list.concat(this.mapNodeToEvents(node, id, desc)), [])
                    .sort((a, b) => a.start && b.start ? a.start.valueOf() - b.start.valueOf() : 0);
            })
            .then(events => ({
                events,
                meta: [{id, valid: true}],
                extra: {ref: tz('2020-01-01 08:00', this.timezone())}
            }))
            .catch(err => {
                console.trace(err);
                return {events: [], meta: [], extra: {}};
            });
    }


    finderUrl() {
        return `${this.url()}/finder.xml`;
    }

    calendarUrl(id: string) {
        const realId = id.substring(this.prefix().length);
        return `${this.url()}/${realId}.xml`;
    }

    private dateFromCourseTime(week: string, day: number, hour: string, weeks: CelcatWeekDesc): Moment|null {
        let match = weeks.find(weekDesc => weekDesc.week === week);
        if (match) {
            let parsed = tz(`${match.date} ${hour}`, 'DD/MM/YYYY hh:mm', this.timezone());
            return parsed.add(day, 'days');
        } else {
            return null;
        }
    }


    private mapNodeToEvents(node: Element, calendar: string, weeks: CelcatWeekDesc): CalendarEvent[] {

        const get = nodeGetText(node);
        const attr = nodeGetAttr(node);
        let id = attr('id');
        let colour = '#' + attr('colour', 'CCCCCC');
        let description = get('notes');
        let organizer = get('resources/staff/item');
        let category = get('category');
        let subjects = node.find('resources/module/item')
            .map(n => (n as Element).text());
        if (subjects.length === 0) subjects = [UNKNOWN_SUBJECT];
        let location: string[] = node.find('resources/room/item')
            .map(n => (n as Element).text());
        let day = parseInt(get('day'), 10);
        let week = get('rawweeks');
        let start = this.dateFromCourseTime(week, day, get('starttime'), weeks);
        let end = this.dateFromCourseTime(week, day, get('endtime'), weeks);

        return subjects.map((subject: string, i) => this.mapEvent({
            id: id + i.toString(),
            colour,
            start,
            end,
            subject,
            location,
            description,
            organizer,
            category,
            calendar
        }));
    }

}

type GetText = (xpath: string, fallback?: string) => string;
function nodeGetText(node: Element): GetText {
    return (xpath, fallback = '') => (node.get(xpath) || {text: () => fallback}).text();
}

type GetAttr = (attr: string, fallback?: string) => string;
function nodeGetAttr(node: Element): GetAttr {
    return (attr, fallback = '') => (node.attr(attr) || {value: () => fallback}).value();
}