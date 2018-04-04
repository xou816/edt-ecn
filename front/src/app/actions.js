import {parse} from 'date-fns';
import {eventId} from './event';
import {push} from 'react-router-redux';

export function getCalendarList() {
    return (dispatch) => {
        dispatch({type: 'LOAD_START'});
        return fetch(`/api/calendar/list`)
            .then(res => res.json())
            .then(list => dispatch({type: 'SET_LIST', list}))
            .then(_ => dispatch({type: 'LOAD_END'}));
    }
}

export function getCalendar(id) {
    return (dispatch, getState) => {
        dispatch({type: 'LOAD_START'});
        return fetch(`/api/calendar/custom/${id || getState().app.calendar}`)
            .then(res => res.json())
            .then(cal => {
                let filters = cal.meta.reduce((final, meta) => ({...final, [meta.id]: meta.filter || []}), {});
                let selection = cal.meta.map(meta => meta.id);
                dispatch({type: 'SET_SELECTION', selection});
                dispatch({type: 'SET_FILTER', filters});
                return cal.events;
            })
            .then(events => events.map(e => ({...e, start: parse(e.start), end: parse(e.end), id: eventId(e)})))
            .catch(err => [])
            .then(events => dispatch({type: 'SET_EVENTS', events}))
            .then(_ => dispatch({type: 'LOAD_END'}));
    };
}

export function getSubjects() {
    return (dispatch, getState) => {
        dispatch({type: 'LOAD_START'});
        let ids = getState().app.selection;
        return ids.reduce((p, id) => p.then(final =>
                fetch(`/api/calendar/custom/${id}/subjects`)
                    .then(res => res.json())
                    .then(res => ({...final, [id]: res}))),
            Promise.resolve({}))
            .then(subjects => dispatch({type: 'SET_SUBJECTS', subjects}))
            .then(_ => dispatch({type: 'LOAD_END'}));
    }
}

export function applySelection() {
    return (dispatch, getState) => {
        let ids = getState().app.selection;
        let filters = getState().app.filters;
        let meta = ids.reduce((meta, id) => meta.concat([{id, filter: filters[id]}]), []);
        dispatch({type: 'LOAD_START'});
        return fetch(`/api/calendar/custom`, {
                method: 'POST',
                body: JSON.stringify(meta),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => res.json())
            .then(res => dispatch(push(`/${res.result}`)))
            .then(_ => dispatch({type: 'LOAD_END'}));
    }
}

export function resetSelection() {
    return {type: 'SET_SELECTION', selection: []};
}

export function resetSubjects() {
    return {type: 'SET_FILTER', filters: {}};
}

export function toggleCalendar(id) {
    return {type: 'TOGGLE_CALENDAR', calendar: id};
}

export function toggleSubject(calendar, subject) {
    return {type: 'TOGGLE_SUBJECT', calendar, subject};
}

export function next() {
    return (dispatch, getState) => {
        let isPhone = getState().responsive.isPhone;
        dispatch(isPhone ? {type: 'NEXT_DAY'} : {type: 'NEXT_WEEK'});
    }
}

export function prev() {
    return (dispatch, getState) => {
        let isPhone = getState().responsive.isPhone;
        dispatch(isPhone ? {type: 'PREV_DAY'} : {type: 'PREV_WEEK'});
    }
}

export function today() {
    return {type: 'TODAY'};
}

export function toggleMenu() {
    return {type: 'TOGGLE_MENU'};
}