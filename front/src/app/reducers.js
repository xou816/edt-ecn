import {addDays, addWeeks, isFriday, isMonday, subDays, subWeeks} from "date-fns";
import {toggleCalendar, toggleSubject, resetSubjects} from "./meta";

export const initialState = {
	list: [],
	events: [],
	date: new Date(),
    loading: true,
	menu: false,
	subjects: {},
	focus: null,
	calendar: null,
	meta: []
};

function toggle(list, value) {
	return list.indexOf(value) > -1 ? list.filter(l => l !== value) : list.concat([value]);
}

export function appReducer(state, action) {
	switch (action.type) {
		case 'SET_EVENTS':
			return {...state, events: action.events};
		case 'SET_LIST':
			return {...state, list: action.list};
		case 'SET_SUBJECTS':
    		return {...state, subjects: action.subjects};
		case 'TOGGLE_CALENDAR':
			return {...state, meta: toggleCalendar(state.meta, action.calendar)};
		case 'TOGGLE_SUBJECT':
			return {...state, meta: toggleSubject(state.meta, action.calendar, action.subject)};
		case 'RESET_CALENDARS':
			return {...state, meta: []};
		case 'RESET_SUBJECTS':
			return {...state, meta: resetSubjects(state.meta)};
		case 'SET_META':
			return {...state, meta: action.meta};
		case 'NEXT_WEEK':
            return {...state, date: addWeeks(state.date, 1)};
		case 'PREV_WEEK':
			return {...state, date: subWeeks(state.date, 1)};
		case 'NEXT_DAY':
			return {...state, date: addDays(state.date, isFriday(state.date) ? 3 : 1)};
		case 'PREV_DAY':
			return {...state, date: subDays(state.date, isMonday(state.date) ? 3 : 1)};
        case 'LOAD_START':
            return {...state, loading: true};
        case 'LOAD_END':
            return {...state, loading: false};
        case 'TODAY':
            return {...state, date: new Date()};
		case 'TOGGLE_MENU':
			return {...state, menu: !state.menu};
		case 'FOCUS_EVENT':
			return {...state, focus: action.event};
		case 'BLUR_EVENT':
			return {...state, focus: null};
		default:
			return {...initialState, ...state};
	}
}