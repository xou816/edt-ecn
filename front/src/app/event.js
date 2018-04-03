const INCREMENT = 1000 * 60 * 15;
const DAY_MS = 1000 * 60 * 60 * 24;

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
    return charcode(JSON.stringify(event));
}

export const PREFIXES = {
    'OD': 'Option disciplinaire',
    'EI': 'Cycle ingénieur',
    'AP': 'Cycle ingénieur apprenti',
    'BTP': 'BTP',
    'M1': 'Master 1',
    'M2': 'Master 2',
    'MECA': 'Filière mécanique',
    'OP': 'Option profesionnelle',
    'PROMO': 'Promo EI1',
    '': 'Autres'
};