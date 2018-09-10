import {CalendarEvent, Events, Subjects} from "./calendar";

export function __getSubjectFromEvent(event: CalendarEvent): string {
    return event.subject !== event.full_subject ?
        `${event.subject} (${event.full_subject})` :
        event.subject;
}

export function __getSubjects(events: Events): Subjects {
    return events
        .filter(e => e.subject.length > 0)
        .sort((a, b) => a.start && b.start && a.start < b.start ? -1 : 1)
        .reduce((final: Subjects, event) => {
            let subject = __getSubjectFromEvent(event);
            let [exists, len] = final.reduce(([exists, len], actualSub) => {
                let sameCalendar = actualSub.calendar === event.calendar;
                let sameSubject = actualSub.name === subject;
                return [
                    exists as boolean || sameSubject && sameCalendar,
                    len as number + (sameCalendar ? 1 : 0)
                ];
            }, [false, 0]);
            return final.concat(exists ? [] : [{
                name: subject,
                full_name: null,
                id: len as number,
                calendar: event.calendar
            }])
        }, []);
}