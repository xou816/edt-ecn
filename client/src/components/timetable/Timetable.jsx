import React from 'react';
import {addHours, differenceInMinutes, isSameDay, startOfDay, startOfISOWeek, addDays} from "date-fns";
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
        paddingRight: '1em',
        flex: '1',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
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

    fix(date) {
        let {refHour} = this.props;
        return addHours(date, refHour);
    }

    get date() {
        let {mobile, renderDate} = this.props;
        return !mobile ?
            this.fix(startOfISOWeek(renderDate, {weekStartsOn: 1})) :
            this.fix(startOfDay(renderDate));
    }

    get selectedDate() {
        return this.fix(startOfDay(this.props.renderDate));
    }

    get startEndDates() {
        let {mobile} = this.props;
        let from = this.date;
        let to = !mobile ?
            addDays(from, 5) :
            addHours(from, 10);
        return {from: from.valueOf(), to: to.valueOf()};
    }


    render() {
        let {classes, mobile, active, currDate} = this.props;

        const date = this.date;
        const IsVisible = IsVisibleOn(currDate);
        const startEndDates = this.startEndDates;

        return (
            <OffsetProvider value={date}>
                <div className={classes.root}>
                    <NoSsr>
                        {!mobile && currDate !== null && <CurrentDay date={currDate}/>}
                    </NoSsr>

                    <Days length={mobile ? 1 : 5} date={date}/>

                    <Separators days={mobile ? 1 : 5}/>

                    <TimetableEvents group="conflict" {...startEndDates}>
                        {events => <React.Fragment><Hours events={events} actualDate={this.selectedDate}/><Courses events={events} /></React.Fragment>}
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