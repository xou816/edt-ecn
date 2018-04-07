import {parse} from 'date-fns';
import {eventId} from './event';
import {history} from "../index";

export function getCalendarList() {
    return (dispatch) => {
        dispatch({type: 'LOAD_START'});
        return fetch(`/api/calendar/list`)
            .then(res => res.json())
            .then(list => dispatch({type: 'SET_LIST', list}))
            .then(_ => dispatch({type: 'LOAD_END'}));
    }
}

export function getCalendar() {
    return (dispatch, getState) => {
        dispatch({type: 'LOAD_START'});
        return fetch(`/api/calendar/custom/${getState().app.calendar}`)
            .then(res => res.json())
            .then(cal => {
                dispatch({type: 'SET_META', meta: cal.meta});
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
        let ids = getState().app.meta.map(meta => meta.id);
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
        let {meta, calendar} = getState().app;
        if (calendar === null) {
            dispatch({type: 'LOAD_START'});
            return fetch(`/api/calendar/custom`, {
                method: 'POST',
                body: JSON.stringify(meta),
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => res.json())
                .then(res => dispatch(setCalendar(res.result)))
                .then(_ => dispatch({type: 'LOAD_END'}));
        } else {
            return Promise.resolve();
        }
    }
}

export function setCalendar(calendar) {
    let pathname = `/${calendar}`;
    if (history.location.pathname !== pathname) {
        history.push({pathname: '/'+calendar});
    }
    return {type: 'SET_CALENDAR', calendar};
}

export function resetCalendars() {
    return {type: 'RESET_CALENDARS'};
}

export function resetSubjects() {
    return {type: 'RESET_SUBJECTS'};
}

export function toggleCalendar(calendar) {
    return {type: 'TOGGLE_CALENDAR', calendar};
}

export function toggleSubject(calendar, subject) {
    return {type: 'TOGGLE_SUBJECT', calendar, subject};
}

export function focusEvent(id) {
    return {type: 'FOCUS_EVENT', event: id};
}

export function blurEvent() {
    return {type: 'BLUR_EVENT'};
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