import {parse} from 'date-fns';
import {history} from "../index";

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
                .then(events => events.map(e => ({...e, start: parse(e.start), end: parse(e.end)})))
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

export function applySelection() {
    return (dispatch, getState) => {
        let {meta, calendar} = getState().app;
        if (calendar === null && meta.length > 0) {
            dispatch({type: 'LOAD_START'});
            return fetch(`/api/calendar/custom`, {
                method: 'POST',
                body: JSON.stringify(meta),
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(res => dispatch(setCalendar(res.result)))
                .catch(err => {})
                .then(_ => dispatch({type: 'LOAD_END'}));
        } else {
            return Promise.resolve();
        }
    }
}

export function setCalendar(calendar) {
    return (dispatch, getState) => {
        let pathname = `/${calendar}`;
        if (history.location.pathname !== pathname) {
            history.push({pathname: '/'+calendar});
        }
        let action = getState().app.calendar !== calendar ?
            {type: 'SET_CALENDAR', calendar} :
            Promise.resolve();
        dispatch(action);
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