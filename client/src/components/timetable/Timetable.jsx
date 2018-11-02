import React from 'react';
import {addHours, startOfDay, startOfWeek, differenceInMinutes, isSameWeek, isSameDay} from "date-fns";
import {TimetableEvents} from "./TimetableEvents";
import withStyles from "@material-ui/core/styles/withStyles";
import NoSsr from "@material-ui/core/NoSsr/NoSsr";
import {Days, Hour, Hours, IsVisibleOn, Marker, OffsetProvider, Separators, Today, withRefHour} from "./TimetableUtils";
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
        [theme.breakpoints.down(767)]: {
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

    get date() {
        let {date, days} = this.props;
        return days > 1 ? startOfWeek(date, {weekStartsOn: 1}) : startOfDay(date);
    }

    startOf(date) {
        return addHours(startOfDay(date), this.props.refHour);
    }

    getHours(offset, events) {
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

    render() {
        let {classes, days, active, currDate} = this.props;

        const offset = this.startOf(this.date);
        const IsVisible = IsVisibleOn(this.date);
        const currDateOffset = this.startOf(currDate);

        return (
            <OffsetProvider value={offset}>
                <TimetableEvents days={days} offset={offset}>
                    {events => (<div className={classes.root}>

                        <NoSsr>
                            {days > 1 && <Today date={currDateOffset}/>}
                        </NoSsr>

                        <Days length={days} date={this.date}/>
                        <Separators days={days}/>

                        {active ?
                            this.getHours(currDateOffset, events).map(([hour, important]) => <Hour important={important} key={hour.valueOf()} hour={hour}/>) :
                            <Hours day={this.date}/>
                        }

                        {events.map(([key, eventGroup]) => <CourseWrapper key={key} events={eventGroup}/>)}

                        <NoSsr>
                            <IsVisible date={Date.now()}><Marker/></IsVisible>
                        </NoSsr>

                        <FocusedCourse allowFocus={active}/>

                    </div>)}
                </TimetableEvents>
            </OffsetProvider>
        );
    }

}