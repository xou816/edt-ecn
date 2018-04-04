import {addDays, addWeeks, isFriday, isMonday, subDays, subWeeks} from "date-fns";

export const initialState = {
	list: [],
	events: [],
	date: new Date(),
    loading: true,
	menu: false,
	selection: [],
	subjects: {},
	filters: {}
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
		case 'TOGGLE_CALENDAR':
			return {...state, selection: toggle(state.selection, action.calendar)};
		case 'SET_SELECTION':
			return {...state, selection: action.selection};
		case 'RESET_SELECTION':
			return {...state, selection: []};
		case 'TOGGLE_SUBJECT':
			return {...state, filters: {...state.filters, [action.calendar]: toggle(state.filters[action.calendar] || [], action.subject)}}
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
		case 'SET_SUBJECTS':
			return {...state, subjects: action.subjects};
		default:
			return {...initialState, ...state};
	}
}