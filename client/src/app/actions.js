import {addDays, addWeeks, isEqual, isFriday, isMonday, parse, subDays, subWeeks} from "date-fns";
import {parseIso} from './event';
import {updateHistory} from "./routing";
import 'cross-fetch/polyfill';

const API = `${process.env.PUBLIC}/api`;

export function getCalendarList() {
    return dispatch => {
        dispatch({type: 'LOAD_START'});
        return fetch(`${API}/calendar/list`)
            .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
            .then(list => dispatch({type: 'SET_LIST', list}))
            .catch(err => {
            })
            .then(_ => dispatch({type: 'LOAD_END'}));
    }
}

export function getCalendar(calendar) {
    return dispatch => {
        if (calendar != null) {
            dispatch({type: 'LOAD_START'});
            return fetch(`${API}/calendar/custom/${calendar}`)
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(calendar => {
                    dispatch({type: 'SET_META', meta: calendar.version === 'version_one' ? calendar.meta : []});
                    return calendar.events;
                })
                .then(events => events.map(e => ({...e, start: parseIso(e.start), end: parseIso(e.end)})))
                .then(events => dispatch({type: 'SET_EVENTS', events}))
                .catch(err => {
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
            return fetch(`${API}/calendar/custom/${ids}/subjects`)
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(res => res.reduce((indexed, cur) => {
                    return {...indexed, [cur.calendar]: (indexed[cur.calendar] || []).concat([cur])};
                }, {}))
                .then(subjects => dispatch({type: 'SET_SUBJECTS', subjects}))
                .catch(err => {
                })
                .then(_ => dispatch({type: 'LOAD_END'}));
        } else {
            return Promise.resolve();
        }
    }
}

export function applySelection() {
    return (dispatch, getState) => {
        let {meta, calendar} = getState().app;
        if (meta.length > 0) {
            dispatch({type: 'LOAD_START'});
            return fetch(`${API}/calendar/custom`, {
                method: 'POST',
                body: JSON.stringify(meta),
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(res => {
                    dispatch({type: 'LOAD_END'});
                    return res.result;
                })
                .catch(console.error);
        } else {
            return Promise.resolve(calendar);
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