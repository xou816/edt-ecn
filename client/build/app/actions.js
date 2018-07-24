"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getCalendarList = getCalendarList;
exports.getCalendar = getCalendar;
exports.showError = showError;
exports.getSubjects = getSubjects;
exports.applySelection = applySelection;
exports.setCalendar = setCalendar;
exports.resetCalendars = resetCalendars;
exports.resetSubjects = resetSubjects;
exports.toggleCalendar = toggleCalendar;
exports.toggleSubject = toggleSubject;
exports.focusEvent = focusEvent;
exports.blurEvent = blurEvent;
exports.next = next;
exports.prev = prev;
exports.setDate = setDate;
exports.toggleMenu = toggleMenu;

var _dateFns = require("date-fns");

var _event = require("./event");

var _routing = require("./routing");

require("cross-fetch/polyfill");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var API = process.env.PUBLIC + "/api";

function getCalendarList() {
    return function (dispatch) {
        dispatch({ type: 'LOAD_START' });
        return fetch(API + "/calendar/list").then(function (res) {
            return res.status >= 400 ? Promise.reject('error') : res.json();
        }).then(function (list) {
            return dispatch({ type: 'SET_LIST', list: list });
        }).catch(function (err) {}).then(function (_) {
            return dispatch({ type: 'LOAD_END' });
        });
    };
}

function getCalendar(calendar) {
    return function (dispatch) {
        if (calendar !== null) {
            dispatch({ type: 'LOAD_START' });
            return fetch(API + "/calendar/custom/" + calendar).then(function (res) {
                return res.status >= 400 ? Promise.reject('error') : res.json();
            }).then(function (calendar) {
                dispatch({ type: 'SET_META', meta: calendar.version === 'version_one' ? calendar.meta : [] });
                return calendar.events;
            }).then(function (events) {
                return events.map(function (e) {
                    return _extends({}, e, { start: (0, _event.parseIso)(e.start), end: (0, _event.parseIso)(e.end) });
                });
            }).then(function (events) {
                return dispatch({ type: 'SET_EVENTS', events: events });
            }).catch(function (err) {
                dispatch({ type: 'SET_CALENDAR', calendar: null });
                dispatch({ type: 'SET_META', meta: [] });
                dispatch(showError('Calendrier inexistant!'));
            }).then(function (_) {
                return dispatch({ type: 'LOAD_END' });
            });
        } else {
            return Promise.resolve();
        }
    };
}

function showError(message) {
    return function (dispatch) {
        dispatch({ type: 'ERROR', message: message });
        setTimeout(function () {
            return dispatch({ type: 'ERROR', message: null });
        }, 3000);
    };
}

function getSubjects() {
    return function (dispatch, getState) {
        var meta = getState().app.meta;
        if (meta.length > 0) {
            dispatch({ type: 'LOAD_START' });
            var ids = meta.map(function (meta) {
                return meta.id;
            }).join('+');
            return fetch(process.env.HOST + "/api/calendar/custom/" + ids + "/subjects").then(function (res) {
                return res.status >= 400 ? Promise.reject('error') : res.json();
            }).then(function (res) {
                return res.reduce(function (indexed, cur) {
                    return _extends({}, indexed, _defineProperty({}, cur.calendar, (indexed[cur.calendar] || []).concat([cur])));
                }, {});
            }).then(function (subjects) {
                return dispatch({ type: 'SET_SUBJECTS', subjects: subjects });
            }).catch(function (err) {}).then(function (_) {
                return dispatch({ type: 'LOAD_END' });
            });
        } else {
            return Promise.resolve();
        }
    };
}

function applySelection() {
    return function (dispatch, getState) {
        var _getState$app = getState().app,
            meta = _getState$app.meta,
            calendar = _getState$app.calendar;

        if (meta.length > 0) {
            dispatch({ type: 'LOAD_START' });
            return fetch(API + "/calendar/custom", {
                method: 'POST',
                body: JSON.stringify(meta),
                headers: { 'Content-Type': 'application/json' }
            }).then(function (res) {
                return res.status >= 400 ? Promise.reject('error') : res.json();
            }).then(function (res) {
                return dispatch(setCalendar(res.result));
            }).then(function (res) {
                return dispatch({ type: 'LOAD_END' });
            }).catch(console.error);
        } else {
            return Promise.resolve(calendar);
        }
    };
}

function setCalendar(calendar) {
    return function (dispatch, getState, _ref) {
        var history = _ref.history;

        var state = getState();
        if (state.app.calendar !== calendar && calendar != null && calendar.length > 0) {
            dispatch({ type: 'SET_CALENDAR', calendar: calendar });
            (0, _routing.updateHistory)(history, { calendar: calendar });
            return dispatch(getCalendar(calendar));
        }
    };
}

function resetCalendars() {
    return { type: 'RESET_CALENDARS' };
}

function resetSubjects() {
    return { type: 'RESET_SUBJECTS' };
}

function toggleCalendar(calendar) {
    return { type: 'TOGGLE_CALENDAR', calendar: calendar };
}

function toggleSubject(calendar, subject) {
    return { type: 'TOGGLE_SUBJECT', calendar: calendar, subject: subject };
}

function focusEvent(id) {
    return { type: 'FOCUS_EVENT', event: id };
}

function blurEvent() {
    return { type: 'BLUR_EVENT' };
}

function next() {
    return function (dispatch, getState) {
        var state = getState();
        var isPhone = state.responsive.isPhone;
        var current = state.app.date;
        var date = isPhone ? (0, _dateFns.addDays)(current, (0, _dateFns.isFriday)(current) ? 3 : 1) : (0, _dateFns.addWeeks)(current, 1);
        return dispatch(setDate(date));
    };
}

function prev() {
    return function (dispatch, getState) {
        var state = getState();
        var isPhone = state.responsive.isPhone;
        var current = state.app.date;
        var date = isPhone ? (0, _dateFns.subDays)(current, (0, _dateFns.isMonday)(current) ? 3 : 1) : (0, _dateFns.subWeeks)(current, 1);
        dispatch(setDate(date));
    };
}

function setDate(date) {
    return function (dispatch, getState, _ref2) {
        var history = _ref2.history;

        var state = getState();
        if (!(0, _dateFns.isEqual)(state.app.date, date)) {
            dispatch({ type: 'SET_DATE', date: date });
            (0, _routing.updateHistory)(history, { date: date });
        }
    };
}

function toggleMenu() {
    return { type: 'TOGGLE_MENU' };
}