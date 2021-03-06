import {linkToCalendar, parseIso} from './event';
import 'cross-fetch/polyfill';
import {safeMeta} from "./meta";
import {getHours} from 'date-fns';
import {View} from "../components/timetable/timeviewAware";

const API = `${process.env.PUBLIC}/api`;

export function getCalendarList() {
    return dispatch => {
        dispatch({type: 'LOAD_START'});
        return fetch(`${API}/calendar/list`)
            .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
            .then(list => dispatch({type: 'SET_LIST', list}))
            .catch(err => {})
            .then(_ => dispatch({type: 'LOAD_END'}));
    }
}

function pushCacheEntry(list, calendar) {
    if (list.length === 0) return;
    const cachedCalendars = JSON.parse(localStorage.getItem('cachedCalendars') || '{}');
    const getName = id => (list.find(desc => desc.id === id) || {name: id}).name;
    const name = calendar.meta.map(meta => getName(meta.id)).join(' + ');
    localStorage.setItem('cachedCalendars', JSON.stringify({...cachedCalendars, [calendar.id]: name}));
}

export function getRecent() {
    const cachedCalendars = JSON.parse(localStorage.getItem('cachedCalendars') || '{}');
    return dispatch => {
        caches.open('calendars')
            .then(cache => cache.keys()
                .then(keys => Promise.all(keys.map(req => cache.match(req)))))
            .then(keys => Promise.all(keys.map(res => res.clone().json())))
            .then(history => history.map(calendar => calendar.id != null && cachedCalendars[calendar.id] != null ? {
                    id: calendar.id,
                    name: cachedCalendars[calendar.id]
            } : null).filter(entry => entry !== null))
            .then(history => {
                history.reverse();
                const newCache = history.reduce((dict, entry) => ({...dict, [entry.id]: entry.name}), {});
                localStorage.setItem('cachedCalendars', JSON.stringify(newCache));
                dispatch({type: 'SET_HISTORY', history});
            });
    }
}

export function getCalendar(calendar) {
    return (dispatch, getState) => {
        const list = getState().app.list;
        if (calendar != null) {
            dispatch({type: 'LOAD_START'});
            return fetch(linkToCalendar(calendar))
                .then(res => res.status >= 400 ? Promise.reject('error') : res.json())
                .then(calendar => {
                    pushCacheEntry(list, calendar);
                    dispatch({type: 'SET_REF', ref: getHours(parseIso(calendar.extra.ref)) || 8});
                    dispatch({type: 'SET_META', meta: safeMeta(calendar.meta)});
                    return calendar.events;
                })
                .then(events => events.map(e => ({...e, start: parseIso(e.start), end: parseIso(e.end)})))
                .then(events => dispatch({type: 'SET_EVENTS', events}))
                .catch(err => {
                    dispatch({type: 'SET_META', meta: []});
                    dispatch(showError('CouldNotLoadCalendar'));
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
                .catch(err => {})
                .then(_ => dispatch({type: 'LOAD_END'}));
        } else {
            return Promise.resolve();
        }
    }
}

function isSimpleMeta(meta) {
    return meta.reduce((isSimple, entry) => isSimple && (entry.filter || []).length === 0, true);
}

export function applySelection() {
    return (dispatch, getState) => {
        let meta = getState().app.meta;
        if (isSimpleMeta(meta)) {
            dispatch({type: 'SET_EVENTS', events: []});
            return Promise.resolve(meta.map(entry => entry.id).join('+'));
        } else if (meta.length > 0) {
            dispatch({type: 'LOAD_START'});
            dispatch({type: 'SET_EVENTS', events: []});
            return fetch(`${API}/alias`, {
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

export function focusEvent(event) {
    return {type: 'FOCUS_EVENT', event};
}

export function blurEvent() {
    return {type: 'BLUR_EVENT'};
}

export function setView(view) {
    return {type: 'SET_VIEW', view};
}

export function toggleView() {
    return (dispatch, getState) => {
        const {view} = getState().app;
        const chosen = (view & View.LIST) > 0 ? View.TIMETABLE : View.LIST;
        dispatch({type: 'SET_VIEW', view: chosen});
        return Promise.resolve(chosen);
    }
}