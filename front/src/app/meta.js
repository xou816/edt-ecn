function toggle(collection, element, matches) {
    if (matches == null) {
        matches = (a, b) => a === b;
    }
    let len = collection.length;
    let newCol = collection.filter(current => !matches(current, element));
    return newCol.length < len ?
        newCol :
        newCol.concat([element]);
}

export function toggleCalendar(metas, calendar) {
    return toggle(metas, {id: calendar, filter: []}, (a, b) => a.id === b.id);
}

export function toggleSubject(metas, calendar, subject) {
    return metas.map(meta => meta.id === calendar ?
        {...meta, filter: toggle(meta.filter, subject)} :
        meta);
}

export function resetSubjects(metas) {
    return metas.map(meta => ({...meta, filter: []}));
}

export function getCalendars(metas) {
    return metas.map(meta => meta.id);
}

export function includesCalendar(metas) {
    return calendar => metas.find(meta => meta.id === calendar) != null;
}

export function includesSubject(metas) {
    return subject => metas
        .map(meta => meta.filter.find(i => i === subject) != null)
        .some(t => t);
}

export function countSubjects(metas) {
    return metas.reduce((sum, meta) => sum + meta.filter.length, 0);
}