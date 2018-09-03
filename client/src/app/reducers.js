import {resetSubjects, toggleCalendar, toggleSubject} from "./meta";

export const initialState = {
    list: [],
    events: [],
    date: new Date(),
    loading: false,
    menu: false,
    subjects: {},
    focus: null,
    calendar: null,
    meta: [],
    error: null
};

export function appReducer(state, action) {
    switch (action.type) {
        case 'SET_EVENTS':
            return {...state, events: action.events};
        case 'SET_LIST':
            return {...state, list: action.list};
        case 'SET_CALENDAR':
            return {...state, calendar: action.calendar, events: []};
        case 'SET_SUBJECTS':
            return {...state, subjects: action.subjects};
        case 'TOGGLE_CALENDAR':
            return {...state, calendar: null, subjects: [], meta: toggleCalendar(state.meta, action.calendar)};
        case 'TOGGLE_SUBJECT':
            return {...state, calendar: null, meta: toggleSubject(state.meta, action.calendar, action.subject)};
        case 'RESET_CALENDARS':
            return {...state, calendar: null, subjects: [], meta: []};
        case 'RESET_SUBJECTS':
            return {...state, calendar: null, meta: resetSubjects(state.meta)};
        case 'SET_META':
            return {...state, meta: action.meta, subjects: []};
        case 'LOAD_START':
            return {...state, loading: true};
        case 'LOAD_END':
            return {...state, loading: false};
        case 'SET_DATE':
            return {...state, date: action.date};
        case 'TOGGLE_MENU':
            return {...state, menu: !state.menu};
        case 'FOCUS_EVENT':
            return {...state, focus: action.event};
        case 'BLUR_EVENT':
            return {...state, focus: null};
        case 'ERROR':
            return {...state, error: action.message};
        default:
            return {...initialState, ...state};
    }
}