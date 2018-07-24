'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.initialState = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.appReducer = appReducer;

var _meta = require('./meta');

var initialState = exports.initialState = {
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

function appReducer(state, action) {
	switch (action.type) {
		case 'SET_EVENTS':
			return _extends({}, state, { events: action.events });
		case 'SET_LIST':
			return _extends({}, state, { list: action.list });
		case 'SET_CALENDAR':
			return _extends({}, state, { calendar: action.calendar, events: [] });
		case 'SET_SUBJECTS':
			return _extends({}, state, { subjects: action.subjects });
		case 'TOGGLE_CALENDAR':
			return _extends({}, state, { calendar: null, subjects: [], meta: (0, _meta.toggleCalendar)(state.meta, action.calendar) });
		case 'TOGGLE_SUBJECT':
			return _extends({}, state, { calendar: null, meta: (0, _meta.toggleSubject)(state.meta, action.calendar, action.subject) });
		case 'RESET_CALENDARS':
			return _extends({}, state, { calendar: null, subjects: [], meta: [] });
		case 'RESET_SUBJECTS':
			return _extends({}, state, { calendar: null, meta: (0, _meta.resetSubjects)(state.meta) });
		case 'SET_META':
			return _extends({}, state, { meta: action.meta, subjects: [] });
		case 'LOAD_START':
			return _extends({}, state, { loading: true });
		case 'LOAD_END':
			return _extends({}, state, { loading: false });
		case 'SET_DATE':
			return _extends({}, state, { date: action.date });
		case 'TOGGLE_MENU':
			return _extends({}, state, { menu: !state.menu });
		case 'FOCUS_EVENT':
			return _extends({}, state, { focus: action.event });
		case 'BLUR_EVENT':
			return _extends({}, state, { focus: null });
		case 'ERROR':
			return _extends({}, state, { error: action.message });
		default:
			return _extends({}, initialState, state);
	}
}