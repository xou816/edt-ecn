import React from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {addDays, compareAsc} from "date-fns";

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

function mapEvents(events) {
    let groups = collectGroups(events);
    let indexed = events.reduce((dict, event) => {
        return {...dict, [event.id]: event};
    }, {});
    return groups.map(group => {
        let eventGroup = group.map(id => indexed[id]);
        return [group[0], eventGroup];
    });
}

function getSelectors() {
    return [state => state.app.events, (_, props) => props.offset, (_, props) => props.days];
}

function filterEvents(events, offset, days) {
    return events.filter(event => event.start.valueOf() >= offset && event.start.valueOf() < addDays(offset, days));
}

function makeSelector() {
    return createSelector(getSelectors(), (a, b, c) => mapEvents(filterEvents(a, b, c)));
}


const withEvents = connect(() => {
    const getEvents = makeSelector();
    return (state, props) => ({
        events: getEvents(state, props)
    });
});

export const TimetableEvents = withEvents(({events, children}) => {
    return children(events);
});