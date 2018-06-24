import {addDays, addWeeks, isFriday, isMonday, subDays, subWeeks, parse, format, isEqual} from "date-fns";
import parsePath from "path-to-regexp";

function updateHistory(history, args) {
    let current = parsePath('/:calendar?/:date?').exec(history.location.pathname);
    let {calendar, date} = {calendar: current[1], date: current[2], ...args};
    let pathname;
    if (calendar === null) {
        pathname = '/';
    } else {
        let formatted = format(date || Date.now(), 'YYYYMMDD');
        pathname = `/${calendar}/${formatted}`;
    }
    history.push(pathname);
}

export function getCalendarList() {
    return (dispatch) => {
        dispatch({type: 'LOAD_START'});
        return fetch(`/api/calendar/list`)
            .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
            .then(list => dispatch({type: 'SET_LIST', list}))
            .catch(err => {})
            .then(_ => dispatch({type: 'LOAD_END'}));
    }
}

export function getCalendar() {
    const parseIso = d => parse(d.replace('Z', '+00:00'), 'YYYY-MM-DDThh:mm:ss.SSSZ', Date.now())
    return (dispatch, getState) => {
        let cal = getState().app.calendar;
        if (cal !== null) {
            dispatch({type: 'LOAD_START'});
            return fetch(`/api/calendar/custom/${cal}`)
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(cal => {
                    dispatch({type: 'SET_META', meta: cal.version === 'version_one' ? cal.meta : []});
                    return cal.events;
                })
                .then(events => events.map(e => ({...e, start: parseIso(e.start), end: parseIso(e.end)})))
                .then(events => dispatch({type: 'SET_EVENTS', events}))
                .catch(err => {
                    dispatch({type: 'SET_CALENDAR', calendar: null});
                    dispatch({type: 'SET_META', meta: []});
                    dispatch(showError('Calendrier inexistant!'));
                })
                .then(_ => dispatch({type: 'LOAD_END'}));
        } else {
            return Promise.resolve();
        }
    };
}

export function showError(message) {
    return dispatch => {
        dispatch({type: 'ERROR', message});
        setTimeout(() => dispatch({type: 'ERROR', message: null}), 3000);
    }
}

export function getSubjects() {
    return (dispatch, getState) => {
        let meta = getState().app.meta;
        if (meta.length > 0) {
            dispatch({type: 'LOAD_START'});
            let ids = meta.map(meta => meta.id).join('+');
            return fetch(`/api/calendar/custom/${ids}/subjects`)
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(res => res.reduce((indexed, cur) => {
                    return {...indexed, [cur.calendar]: (indexed[cur.calendar] || []).concat([cur])};
                }, {}))
                .then(subjects => dispatch({type: 'SET_SUBJECTS', subjects}))
                .catch(err => {})
                .then(_ => dispatch({type: 'LOAD_END'}));
        } else {
            return Promise.resolve();
        }
    }
}

export function applySelection(history) {
    return (dispatch, getState) => {
        let {meta, calendar} = getState().app;
        if (meta.length > 0) {
            dispatch({type: 'LOAD_START'});
            return fetch(`/api/calendar/custom`, {
                method: 'POST',
                body: JSON.stringify(meta),
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(res => dispatch(setCalendar(history, res.result)))
                .then(res => dispatch({type: 'LOAD_END'}))
                .catch(console.error);
        } else {
            return Promise.resolve(calendar);
        }
    }
}

export function setCalendar(history, calendar) {
    return (dispatch, getState) => {
        const state = getState();
        if (state.app.calendar !== calendar && calendar != null && calendar.length > 0) {
            updateHistory(history, {
                calendar
            });
            return dispatch({type: 'SET_CALENDAR', calendar});
        }
    }
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

export function next(history) {
    return (dispatch, getState) => {
        const state = getState();
        let isPhone = state.responsive.isPhone;
        let current = state.app.date;
        let date = isPhone ?
            addDays(current, isFriday(current) ? 3 : 1) :
            addWeeks(current, 1);
        return dispatch(setDate(history, date));
    }
}

export function prev(history) {
    return (dispatch, getState) => {
        const state = getState();
        let isPhone = state.responsive.isPhone;
        let current = state.app.date;
        let date = isPhone ?
            subDays(current, isMonday(current) ? 3 : 1) :
            subWeeks(current, 1);
        dispatch(setDate(history, date));
    }
}

export function setDate(history, date) {
    return (dispatch, getState) => {
        const state = getState();
        if (!isEqual(state.app.date, date)) {
            updateHistory(history, {
                date
            });
            dispatch({type: 'SET_DATE', date});
        }
    }
}

export function toggleMenu() {
    return {type: 'TOGGLE_MENU'};
}