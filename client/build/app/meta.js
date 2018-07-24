"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.toggleCalendar = toggleCalendar;
exports.toggleSubject = toggleSubject;
exports.resetSubjects = resetSubjects;
exports.getCalendars = getCalendars;
exports.includesCalendar = includesCalendar;
exports.includesSubject = includesSubject;
exports.countSubjects = countSubjects;
function toggle(collection, element, matches) {
    if (matches == null) {
        matches = function matches(a, b) {
            return a === b;
        };
    }
    var len = collection.length;
    var newCol = collection.filter(function (current) {
        return !matches(current, element);
    });
    return newCol.length < len ? newCol : newCol.concat([element]);
}

function toggleCalendar(metas, calendar) {
    return toggle(metas, { id: calendar, filter: [] }, function (a, b) {
        return a.id === b.id;
    });
}

function toggleSubject(metas, calendar, subject) {
    return metas.map(function (meta) {
        return meta.id === calendar ? _extends({}, meta, { filter: toggle(meta.filter || [], subject) }) : meta;
    });
}

function resetSubjects(metas) {
    return metas.map(function (meta) {
        return _extends({}, meta, { filter: [] });
    });
}

function getCalendars(metas) {
    return metas.map(function (meta) {
        return meta.id;
    });
}

function includesCalendar(metas) {
    return function (calendar) {
        return metas.find(function (meta) {
            return meta.id === calendar;
        }) != null;
    };
}

function includesSubject(metas) {
    return function (calendar, subject) {
        return metas.filter(function (meta) {
            return meta.id === calendar;
        }).map(function (meta) {
            return (meta.filter || []).find(function (i) {
                return i === subject;
            }) != null;
        }).some(function (t) {
            return t;
        });
    };
}

function countSubjects(metas) {
    return metas.reduce(function (sum, meta) {
        return sum + (meta.filter || []).length;
    }, 0);
}