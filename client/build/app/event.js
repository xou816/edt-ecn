'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseIso = parseIso;
exports.subjectId = subjectId;

var _dateFns = require('date-fns');

var INCREMENT = 1000 * 60 * 15;
var DAY_MS = 1000 * 60 * 60 * 24;

function parseIso(d) {
    return (0, _dateFns.parse)(d.replace('Z', '+00:00'), 'YYYY-MM-DDThh:mm:ss.SSSZ', Date.now());
}

function charcode(string) {
    return Array.from(string).map(function (c) {
        return c.charCodeAt(0);
    }).reduce(function (sum, curr) {
        return sum + curr;
    }, 0);
}

function subjectId(event) {
    var sub = event.full_subject;
    return charcode(sub);
}