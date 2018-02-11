import {parse} from 'date-fns';

function charcode(string) {
    return Array.from(string)
        .map(c => c.charCodeAt(0))
        .reduce((sum, curr) => sum + curr, 0);
}

export function subjectId(event) {
    let sub = event.subject;
    return charcode(sub);
}

export function eventId(event) {
    return charcode(event.subject) + charcode(event.location) + parse(event.start).valueOf();
}