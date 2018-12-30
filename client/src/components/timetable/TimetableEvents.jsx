import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {compareAsc, isAfter, isBefore, isEqual, isSameDay} from "date-fns";

function setIntersection(a, b) {
    return a.some(ae => b.indexOf(ae) > -1) || b.some(be => a.indexOf(be) > -1);
}

function isLargerSet(a, b) {
    return a.length > b.length;
}

function collectGroups(events) {
    return events.reduce((conflicts, event, i, all) => {
        let inConflict = all.reduce((ids, e) => {
            let conflict = e.id !== event.id && (compareAsc(event.start, e.end) * compareAsc(event.end, e.start)) < 0;
            return conflict ? ids.concat([e.id]) : ids;
        }, []);
        if (inConflict.length > 0) {
            inConflict.push(event.id);
            conflicts = conflicts.length === 0 ? [inConflict] : conflicts
                .reduce((newConflicts, olderConflict) => {
                    return setIntersection(olderConflict, inConflict) && isLargerSet(inConflict, olderConflict) ?
                        newConflicts : newConflicts.concat([olderConflict]);
                }, []);
            return conflicts.some(olderConflict => setIntersection(olderConflict, inConflict)) ?
                conflicts : conflicts.concat([inConflict]);
        } else {
            return conflicts.concat([[event.id]]);
        }
    }, []);
}

function groupConflicts(events) {
    let groups = collectGroups(events);
    let indexed = events.reduce((dict, event) => {
        return {...dict, [event.id]: event};
    }, {});
    return groups.map(group => {
        let eventGroup = group.map(id => indexed[id]);
        return [group[0], eventGroup];
    });
}

function groupDays(events) {
    return events.reduce((acc, event) => {
        let added = false;
        return acc
            .map(([day, group]) => {
                if (isSameDay(day, event.start)) {
                    added = true;
                    return [day, group.concat([event])];
                } else {
                    return [day, group];
                }
            })
            .concat(added ? [] : [[event.start, [event]]]);
    }, []);
}

function getSelectors() {
    return [({app}) => app.events, (_, {from}) => from, (_, {to}) => to, (_, {group}) => group];
}

function filterEvents(events, from, to) {
    return events.filter(event => (isEqual(event.start, from) || isAfter(event.start, from)) &&
        (isEqual(event.start, to) || isBefore(event.start, to)));
}

function mapEvents(events, group) {
    switch (group) {
        case 'conflict':
            return groupConflicts(events);
        case 'day':
            return groupDays(events);
        default:
            return events;
    }
}

const withEvents = connect(() => {
    const getEvents = createSelector(
        getSelectors(),
        (ev, from, to, group) => mapEvents(filterEvents(ev, from, to), group));
    return (state, props) => ({
        events: getEvents(state, props)
    });
});

export const TimetableEvents = withEvents(({events, children}) => {
    return children(events);
});
