import {parse} from 'date-fns';

export function parseIso(d) {
    return parse(d, "u-MM-dd'T'HH:mm:ss.SSSXXX", Date.now());
}

function charcode(string) {
    return Array.from(string)
        .map(c => c.charCodeAt(0))
        .reduce((sum, curr) => sum + curr, 0);
}

export function subjectId(event) {
    let sub = event.subject === 'unknown' ? event.colour : event.full_subject;
    return charcode(sub);
}