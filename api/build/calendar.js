"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_timezone_1 = require("moment-timezone");
var ical = require("ical-generator");
var node_fetch_1 = require("node-fetch");
var crypto_1 = require("crypto");
var libxmljs_1 = require("libxmljs");
var filter_1 = require("./filter");
var legacy_1 = require("./legacy");
var FILTER = 'Groupe';
var WARN_MESSAGE = "(!) Ce calendrier n'est peut être pas à jour. Les filtres sont désactivés par sécurité.";
var Version;
(function (Version) {
    Version["LATEST"] = "version_one";
    Version["UNKNOWN"] = "version_unknown";
    Version["ONE"] = "version_one";
})(Version || (Version = {}));
var VERSIONS = [Version.UNKNOWN, Version.ONE];
var calendarList = 'http://website.ec-nantes.fr/sites/edtemps/finder.xml';
var calendarUrl = function (id) { return "http://website.ec-nantes.fr/sites/edtemps/" + id + ".xml"; };
function listOnlineCalendars(type) {
    if (type === void 0) { type = 'group'; }
    return node_fetch_1.default(calendarList)
        .then(function (res) { return res.text(); })
        .then(function (body) { return libxmljs_1.parseXmlString(body); })
        .then(function (doc) { return doc.find('/finder/resource')
        .map(function (node) {
        var type = node.attr('type').value();
        return {
            id: type[0] + node.attr('id').value(),
            name: node.get('name'),
            type: type
        };
    })
        .filter(function (node) { return node.type === type && node.name != null; })
        .map(function (node) {
        var _a = node.name.text().split(','), name = _a[0], display = _a[1];
        return {
            id: node.id,
            name: name.trim(),
            display: (display || name).trim()
        };
    }); });
}
exports.listOnlineCalendars = listOnlineCalendars;
function getIdFromName(name) {
    return listOnlineCalendars()
        .then(function (calendars) { return calendars
        .find(function (cal) { return cal.name.toLowerCase() === name.toLowerCase(); }); })
        .then(function (cal) { return cal == null ? null : cal.id; });
}
exports.getIdFromName = getIdFromName;
function safeText(node, xpaths, fallback) {
    if (fallback === void 0) { fallback = ''; }
    var found = xpaths.reduce(function (res, xpath) {
        return (res == null || res.length === 0) ? (node.get(xpath) || { text: function () { return null; } }).text() : res;
    }, null);
    return (found || fallback).trim();
}
var ORGANIZER_REGEX = /^([-a-zÀ-ú ]+) \(([-a-zÀ-ú ]+)\)$/i;
var ROOM_REGEX = /^([\w ]+) \(\1\)$/i;
var COURSE_REGEX = /^([\w ]+) \((.*)\)$/i;
function mapNodeToEvent(node, weekNumToFirstDay, calendar) {
    var id = node.attr('id').value();
    var colour = '#' + node.attr('colour').value();
    var day = parseInt(safeText(node, ['day']), 10);
    var week = parseInt(safeText(node, ['prettyweeks']), 10);
    var date = weekNumToFirstDay[week][day];
    var description = safeText(node, ['notes']);
    var organizer = safeText(node, ['resources/staff/item']);
    var res = ORGANIZER_REGEX.exec(organizer);
    if (res != null) {
        organizer = res[2];
    }
    var category = safeText(node, ['category']);
    var subject = safeText(node, ['resources/module/item', 'notes']).split('-').shift() || '';
    var full_subject = subject;
    res = COURSE_REGEX.exec(subject);
    if (res != null) {
        subject = res[1];
        full_subject = res[2];
    }
    var location = node.find('resources/room/item')
        .map(function (n) { return n.text(); })
        .map(function (text) {
        var res = ROOM_REGEX.exec(text);
        return res != null ? res[1] : text;
    })
        .join(', ');
    return {
        id: id,
        colour: colour,
        start: dateFromCourseTime(date, safeText(node, ['starttime'])),
        end: dateFromCourseTime(date, safeText(node, ['endtime'])),
        subject: subject.trim(),
        full_subject: full_subject.trim(),
        location: location,
        description: description,
        organizer: organizer,
        calendar: calendar,
        category: category
    };
}
function dateFromCourseTime(date, hour) {
    return moment_timezone_1.tz(date + " " + hour, 'DD/MM/YYYY hh:mm', 'Europe/Paris');
}
function getOnlineCalendar(id) {
    return node_fetch_1.default(calendarUrl(id))
        .then(function (res) { return res.text(); })
        .then(function (body) { return libxmljs_1.parseXmlString(body); })
        .then(function (doc) {
        var dates = doc.find('/timetable/span').reduce(function (acc, node) {
            var index = parseInt((node.get('title') || { text: function () { return ''; } }).text(), 10);
            acc[index] = node.find('day/date').map(function (date) { return date.text(); });
            return acc;
        }, []);
        return doc.find('//event')
            .map(function (node) { return mapNodeToEvent(node, dates, id); })
            .sort(function (a, b) { return a.start.valueOf() - b.start.valueOf(); });
    })
        .then(function (events) { return ({
        events: events,
        meta: [{ id: id, valid: true }],
        version: Version.LATEST
    }); });
}
exports.getOnlineCalendar = getOnlineCalendar;
var VALID_CAT = ['CM', 'TD', 'TP', 'DS'];
function getSubjectFromEvent(event, version) {
    if (version === void 0) { version = Version.LATEST; }
    if (version === Version.UNKNOWN) {
        return legacy_1.__getSubjectFromEvent(event);
    }
    return event.subject.toUpperCase();
}
function getSubjects(calendar) {
    var version = calendar.version;
    if (version === Version.UNKNOWN) {
        return legacy_1.__getSubjects(calendar.events);
    }
    return calendar.events
        .filter(function (e) { return e.subject.length > 0; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; })
        .reduce(function (final, event) {
        var subject = getSubjectFromEvent(event, version);
        var isIrrelevant = VALID_CAT.indexOf(event.category) === -1;
        if (!isIrrelevant) {
            var _a = final.reduce(function (_a, actualSub) {
                var exists = _a[0], len = _a[1];
                var sameCalendar = actualSub.calendar === event.calendar;
                var sameSubject = actualSub.name === subject;
                return [
                    exists || sameSubject && sameCalendar,
                    len + (sameCalendar ? 1 : 0)
                ];
            }, [false, 0]), exists = _a[0], len = _a[1];
            return exists ? final : final.concat([{
                    name: subject,
                    id: len,
                    calendar: event.calendar
                }]);
        }
        else {
            return final;
        }
    }, []);
}
exports.getSubjects = getSubjects;
function getSingleCustomCalendar(id) {
    var _a = id.split(/[\-_]/), calendarId = _a[0], filterEnc = _a[1], checksum = _a[2], version = _a[3];
    if (filterEnc == null) {
        return getOnlineCalendar(calendarId);
    }
    var actualVersion = version == null ? Version.UNKNOWN : VERSIONS[parseInt(version, 10)];
    var filter = filter_1.Filter.parse(filterEnc);
    return getOnlineCalendar(calendarId)
        .then(function (cal) {
        var events = cal.events;
        cal.version = actualVersion;
        var subjects = getSubjects(cal);
        var warn = checksum != null && checkSubjects(filter, subjects, checksum);
        events = warn ?
            events.map(function (event) { return (__assign({}, event, { description: event.description + WARN_MESSAGE })); }) :
            events
                .filter(function (event) { return filter.test((subjects
                .find(function (s) { return s.name === getSubjectFromEvent(event, actualVersion); }) || { id: 999 }).id); });
        return {
            events: events,
            meta: [{
                    id: calendarId,
                    filter: subjects.map(function (s) { return s.id; }).filter(function (s) { return !filter.test(s); }),
                    valid: !warn
                }],
            version: actualVersion
        };
    });
}
function getCustomCalendar(id) {
    return id.split('+').reduce(function (p, id) {
        return p.then(function (calendar) { return getSingleCustomCalendar(id)
            .then(function (newCalendar) { return (__assign({}, newCalendar, { events: newCalendar.events.filter(function (e) { return calendar.blacklist.indexOf(e.id) === -1; }) })); })
            .then(function (newCalendar) { return ({
            meta: calendar.meta.concat(newCalendar.meta),
            version: newCalendar.version,
            events: calendar.events.concat(newCalendar.events),
            blacklist: calendar.blacklist.concat(newCalendar.events.map(function (e) { return e.id; }))
        }); }); });
    }, Promise.resolve({ meta: [], events: [], blacklist: [], version: Version.UNKNOWN }))
        .then(function (res) {
        delete res.blacklist;
        return res;
    });
}
exports.getCustomCalendar = getCustomCalendar;
function makeChecksum(subjects, length) {
    var str = subjects.map(function (s) { return s.name; }).slice(0, length).join(',');
    return crypto_1.createHash('sha1').update(str).digest('hex').substr(0, 6);
}
function checkSubjects(filter, subjects, checksum) {
    var length;
    if (checksum.indexOf('l') > -1) { // old checksum format!
        var _a = checksum.split('l'), l = _a[0], c = _a[1];
        length = parseInt(l, 10);
        checksum = c;
    }
    else {
        length = filter.length();
    }
    return checksum !== makeChecksum(subjects, length);
}
function createFilter(id, indices, subjects, version) {
    var filter = filter_1.Filter.from(indices);
    return [id, filter.toString(), makeChecksum(subjects, filter.length()), VERSIONS.indexOf(version || Version.ONE)].join('-');
}
exports.createFilter = createFilter;
function createFilterFromMeta(metas) {
    var needFilter = function (meta) { return meta.filter != null && meta.filter.length > 0; };
    return metas.reduce(function (p, meta) { return p.then(function (filters) {
        return (needFilter(meta) ?
            getOnlineCalendar(meta.id)
                .then(function (cal) { return createFilter(meta.id, meta.filter, getSubjects(cal), cal.version); }) :
            Promise.resolve(meta.id))
            .then(function (f) { return filters.concat([f]); });
    }); }, Promise.resolve([]))
        .then(function (filters) { return filters.join('+'); });
}
exports.createFilterFromMeta = createFilterFromMeta;
function calendarToIcs(events) {
    var cal = ical({
        domain: 'ec-nantes.fr',
        name: 'EDT',
        timezone: 'Europe/Paris',
        prodId: { company: 'ec-nantes.fr', product: 'edt' },
    });
    events.forEach(function (event) {
        cal.createEvent({
            start: event.start.tz('UTC').toDate(),
            end: event.end.tz('UTC').toDate(),
            summary: (event.category + ' ' + event.subject).trim(),
            description: event.description,
            location: event.location,
        });
    });
    return cal.toString();
}
exports.calendarToIcs = calendarToIcs;
