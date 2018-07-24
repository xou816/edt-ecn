"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function __getSubjectFromEvent(event) {
    return event.subject !== event.full_subject ?
        event.subject + " (" + event.full_subject + ")" :
        event.subject;
}
exports.__getSubjectFromEvent = __getSubjectFromEvent;
function __getSubjects(events) {
    return events
        .filter(function (e) { return e.subject.length > 0; })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; })
        .reduce(function (final, event) {
        var subject = __getSubjectFromEvent(event);
        var _a = final.reduce(function (_a, actualSub) {
            var exists = _a[0], len = _a[1];
            var sameCalendar = actualSub.calendar === event.calendar;
            var sameSubject = actualSub.name === subject;
            return [
                exists || sameSubject && sameCalendar,
                len + (sameCalendar ? 1 : 0)
            ];
        }, [false, 0]), exists = _a[0], len = _a[1];
        return final.concat(exists ? [] : [{
                name: subject,
                id: len,
                calendar: event.calendar
            }]);
    }, []);
}
exports.__getSubjects = __getSubjects;
