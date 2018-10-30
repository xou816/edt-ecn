import {Moment} from "moment";

export type CalendarId = {
    id: string,
    name: string,
    display: string
};

export type CalendarEvent = {
    id: string,
    calendar: string,
    colour: string,
    start: Moment | null,
    end: Moment | null,
    subject: string,
    full_subject: string,
    category: string,
    location: string[],
    description: string,
    organizer: string,
    pretty: string
};

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
    extra: {}
}

export type Subjects = { id: number, name: string, full_name: string | null, calendar: string, [k: string]: any }[];

export const UNKNOWN_SUBJECT = 'unknown';