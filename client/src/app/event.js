import {parse} from 'date-fns';

const INCREMENT = 1000 * 60 * 15;
const DAY_MS = 1000 * 60 * 60 * 24;

export function parseIso(d) {
	return parse(d.replace('Z', '+00:00'), 'YYYY-MM-DDThh:mm:ss.SSSZ', Date.now());
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