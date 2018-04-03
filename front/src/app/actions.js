import {parse} from 'date-fns';
import {eventId, PREFIXES} from './event';
import {push} from 'react-router-redux';

export function getCalendarList() {
	return (dispatch) => {
		dispatch({type: 'LOAD_START'});
		return fetch(`/api/calendar/list`)
			.then(res => res.json())
			.then(list => list.reduce((acc, calendar) => {
				let prefix = Object.keys(PREFIXES).find(prefix => calendar.name.startsWith(prefix));
				return {...acc, [prefix]: (acc[prefix] || []).concat([calendar])};
			}, {}))
			.then(list => dispatch({type: 'SET_LIST', list}))
			.then(_ => dispatch({type: 'LOAD_END'}));
	}
}

export function getCalendar(id) {
	return (dispatch, getState) => {
		dispatch({type: 'LOAD_START'});
		return fetch(`/api/calendar/custom/${id || getState().app.calendar}`)
			.then(res => res.json())
			.then(events => events.map(e => ({...e, start: parse(e.start), end: parse(e.end), id: eventId(e) })))
            .catch(err => [])
			.then(events => dispatch({type: 'SET_EVENTS', events}))
			.then(_ => dispatch({type: 'LOAD_END'}));
	};
}

export function finishSelection() {
	return (dispatch, getState) => {
		let calendar = getState().app.selection.join('+');
		dispatch(push(`/${calendar}`));
	}
}

export function resetSelection() {
	return {type: 'RESET_SELECTION'};
}

export function toggleCalendar(id) {
	return {type: 'TOGGLE_CALENDAR', calendar: id};
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