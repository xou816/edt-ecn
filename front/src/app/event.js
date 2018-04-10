const INCREMENT = 1000 * 60 * 15;
const DAY_MS = 1000 * 60 * 60 * 24;

function charcode(string) {
    return Array.from(string)
        .map(c => c.charCodeAt(0))
        .reduce((sum, curr) => sum + curr, 0);
}

export function subjectId(event) {
    let sub = event.full_subject;
    return charcode(sub);
}