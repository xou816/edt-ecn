"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.updateStore = updateStore;
exports.updateHistory = updateHistory;

var _pathToRegexp = require("path-to-regexp");

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _dateFns = require("date-fns");

var _actions = require("./actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = '/:calendar?/:date?';

function updateStore(dispatch, history, location) {
    location = location || history.location;
    var promises = [];
    var parsed = (0, _pathToRegexp2.default)(route).exec(location.pathname);
    if (parsed) {
        var calendar = parsed[1];
        var date = (0, _dateFns.parse)(parsed[2], 'YYYYMMDD', Date.now());
        if (calendar && calendar.length > 0) {
            promises.push(dispatch((0, _actions.setCalendar)(calendar)));
        }
        if (date && !isNaN(date.getTime())) {
            promises.push(dispatch((0, _actions.setDate)(date)));
        }
    }
    return Promise.all(promises);
}

function updateHistory(history, args) {
    var compiled = (0, _pathToRegexp.compile)(route);
    var current = (0, _pathToRegexp2.default)(route).exec(history.location.pathname);
    if (args.date) {
        args.date = (0, _dateFns.format)(args.date, 'YYYYMMDD');
    }
    var final = _extends({
        calendar: current[1],
        date: current[2]
    }, args);
    history.push(final.calendar === null ? '/' : compiled(final));
}