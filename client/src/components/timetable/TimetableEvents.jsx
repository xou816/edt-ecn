import React from 'react';
import {connect} from 'react-redux';
import {addDays, compareAsc} from "date-fns";
import {CourseWrapper} from "./CourseWrapper";

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

function mapEvents(events, offset) {
    let groups = collectGroups(events);
    let indexed = events.reduce((dict, event) => {
        return {...dict, [event.id]: event};
    }, {});
    return groups.map(group => {
        let eventGroup = group.map(id => indexed[id]);
        return <CourseWrapper key={`${group.reduce((s, id) => s + id, offset.valueOf())}`} events={eventGroup}
                              offset={offset}/>
    });
}

function isVisible(offset, days) {
    return event => event.start >= offset && event.start < addDays(offset, days);
}


@connect((state, {offset, days}) => ({
    events: state.app.events.filter(isVisible(offset, days)),
}))
export class TimetableEvents extends React.Component {

    render() {
        let {events, offset} = this.props;
        return mapEvents(events, offset);
    }

}