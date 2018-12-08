import React from 'react';
import {addHours, differenceInMinutes, isSameDay, startOfDay, startOfWeek} from "date-fns";
import {TimetableEvents} from "./TimetableEvents";
import withStyles from "@material-ui/core/styles/withStyles";
import NoSsr from "@material-ui/core/NoSsr/NoSsr";
import {CurrentDay, Days, Hour, IsVisibleOn, Marker, OffsetProvider, Separators, withRefHour} from "./TimetableUtils";
import {CourseWrapper} from "./CourseWrapper";
import {FocusedCourse} from "./FocusedCourse";

@withStyles(theme => ({
    root: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '3em repeat(5, 1fr)',
        gridTemplateRows: '1em repeat(45, .7em)',
        gridGap: '.3em .3em',
        padding: '1em 0',
        flex: '1',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        marginRight: '1em',
        [theme.breakpoints.down(769)]: {
            gridTemplateColumns: '3em 1fr',
            gridTemplateRows: '1em repeat(45, .6em)',
            gridGap: '.3em 0'
        }
    },
    btn: {
        padding: '0 .5em',
        minWidth: 0,
        minHeight: 0
    },
}))
@withRefHour
export class Timetable extends React.PureComponent {

    normalizedDate(actual) {
        let {date, days, refHour} = this.props;
        return addHours(
            !actual && days > 1 ? startOfWeek(date, {weekStartsOn: 1}) : startOfDay(date),
            refHour);
    }

    get date() {
        return this.normalizedDate(false);
    }

    get actualDate() {
        return this.normalizedDate(true);
    }


    render() {
        let {classes, days, active, currDate} = this.props;

        const date = this.date;
        const IsVisible = IsVisibleOn(currDate);

        return (
            <OffsetProvider value={date}>
                <div className={classes.root}>
                    <NoSsr>
                        {days > 1 && currDate !== null && <CurrentDay date={currDate}/>}
                    </NoSsr>

                    <Days length={days} date={date}/>

                    <Separators days={days}/>

                    <TimetableEvents group="conflict" days={days} offset={date}>
                        {events => <React.Fragment><Hours events={events} actualDate={this.actualDate}/><Courses events={events} /></React.Fragment>}
                    </TimetableEvents>

                    <NoSsr>
                        <IsVisible date={Date.now()}><Marker/></IsVisible>
                    </NoSsr>

                    <FocusedCourse allowFocus={active}/>
                </div>
            </OffsetProvider>
        );
    }

}

function getHours(offset, events) {
    const hoursFromEvents = events
        .reduce((result, [key, eventGroup]) => result.concat([eventGroup[0].start, eventGroup[0].end]), [])
        .filter(time => isSameDay(time, offset) && time >= offset && time <= addHours(time, 11));
    const conflicts = (a, list) => list.find(b => {
        return Math.abs(differenceInMinutes(a, b)) <= 30;
    }) != null;
    return Array.from({length: 12}, (x, i) => addHours(offset, i))
        .filter(hour => !conflicts(hour, hoursFromEvents))
        .map(hour => [hour, false])
        .concat(hoursFromEvents.map(hour => [hour, true]));
}

const Courses = React.memo(({events}) => {
    return events
        .map(([key, eventGroup]) => <CourseWrapper key={key} events={eventGroup}/>);
});

const Hours = ({actualDate, events}) => {
    return getHours(actualDate, events)
        .map(([hour, important]) => <Hour important={important} key={hour.valueOf()} hour={hour}/>);
};