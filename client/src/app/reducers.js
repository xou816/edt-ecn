import {resetSubjects, toggleCalendar, toggleSubject} from "./meta";

export const initialState = {
    list: [],
    events: [],
    loading: false,
    subjects: {},
    focus: null,
    meta: [],
    error: null,
    history: []
};

export function appReducer(state, action) {
    switch (action.type) {
        case 'SET_EVENTS':
            return {...state, events: action.events};
        case 'SET_LIST':
            return {...state, list: action.list};
        case 'SET_CALENDAR':
            return {...state, events: []};
        case 'SET_SUBJECTS':
            return {...state, subjects: action.subjects};
        case 'TOGGLE_CALENDAR':
            return {...state, meta: toggleCalendar(state.meta, action.calendar)};
        case 'TOGGLE_SUBJECT':
            return {...state, meta: toggleSubject(state.meta, action.calendar, action.subject)};
        case 'RESET_CALENDARS':
            return {...state, meta: [], subjects: []};
        case 'RESET_SUBJECTS':
            return {...state, meta: resetSubjects(state.meta)};
        case 'SET_META':
            return {...state, meta: action.meta};
        case 'LOAD_START':
            return {...state, loading: true};
        case 'LOAD_END':
            return {...state, loading: false};
        case 'FOCUS_EVENT':
            return {...state, focus: action.event};
        case 'BLUR_EVENT':
            return {...state, focus: null};
        case 'ERROR':
            return {...state, error: action.message};
        case 'SET_HISTORY':
            return {...state, history: action.history};
        default:
            return {...initialState, ...state};
    }
}