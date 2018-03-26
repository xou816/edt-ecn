import {addDays, addWeeks, isFriday, isMonday, subDays, subWeeks} from "date-fns";

export const initialState = {
	calendar: null,
	events: [],
	date: new Date(),
    loading: true,
	menu: false
};

export function appReducer(state, action) {
	switch (action.type) {
		case 'SET_CALENDAR':
			return {...state, events: action.events};
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
		default:
			return {...initialState, ...state};
	}
}