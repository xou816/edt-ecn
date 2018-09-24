import React from 'react';
import {addDays, addHours, addMinutes, format, isSameDay, startOfDay, startOfWeek} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {Divider, Typography, NoSsr, withStyles} from "@material-ui/core";
import {TimetableEntry} from "./TimetableEntry";
import {TimetableEvents} from "./TimetableEvents";
import {FocusedCourse} from "./FocusedCourse";

function Separators({days}) {
    return Array.from({length: 12}, (x, i) => (
        <Divider key={`sep_${i}`} style={{gridRow: `${4 * i + 2} / span 4`, gridColumn: `2 / span ${days}`}}/>
    ));
}

function Hours({classes}) {
    return Array.from({length: 12}, (x, i) => (
        <Typography className={classes.hour} align="center" color="textSecondary" key={`hour_${i}`}
                    style={{gridRow: `${4 * i + 2} / span 1`, gridColumn: `1 / span 1`}}>
            {`${8 + i}:00`}
        </Typography>
    ));
}


function Days({length, date}) {
    return Array.from({length}, (x, i) => {
        let curDate = addDays(date, i);
        let today = isSameDay(curDate, Date.now());
        let formatted = format(curDate, 'eee d MMM', {locale: frLocale});
        return (
            <Typography align="center" color={today ? 'primary' : 'textSecondary'} key={formatted}
                        style={{gridColumn: i + 2, gridRow: '1 / span 1'}}>
                {formatted.toUpperCase()}
            </Typography>
        )
    });
}

function Marker({days, offset, classes}) {
    let now = Date.now();
    return now >= offset && now < addDays(offset, days) ? (
        <TimetableEntry event={{start: now, end: addMinutes(now, 15)}} offset={offset}>
            <Divider className={classes.now}/>
        </TimetableEntry>
    ) : <div/>;
}


@withStyles(theme => ({
    root: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '3em repeat(5, 1fr) 1em',
        gridTemplateRows: '1em repeat(45, .7em)',
        gridGap: '.3em .3em',
        padding: '1em 0',
        flex: '1',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down(767)]: {
            gridTemplateColumns: '3em 1fr 1em',
            gridTemplateRows: '1em repeat(45, .6em)',
            gridGap: '.3em 0'
        }
    },
    now: {
        width: '100%',
        backgroundColor: theme.palette.secondary.main,
        height: '2px'
    },
    btn: {
        padding: '0 .5em',
        minWidth: 0,
        minHeight: 0
    },
    hour: {
        marginTop: '-.5em'
    }
}))
export class Timetable extends React.Component {

    get date() {
        let {date, days} = this.props;
        return days > 1 ? startOfWeek(date, {weekStartsOn: 1}) : startOfDay(date);
    }

    get offset() {
        let now = new Date();
        let offset = now.getTimezoneOffset() / -60;
        return addHours(this.date, 8 + offset - 2).valueOf();
    }

    render() {
        let {classes, days, active} = this.props;
        return (
            <div className={classes.root}>
                <Hours classes={classes}/>
                <Separators days={days}/>
                <Days length={days} date={this.date}/>
                <TimetableEvents offset={this.offset} days={days}/>
                <NoSsr><Marker days={days} offset={this.offset} classes={classes}/></NoSsr>
                <FocusedCourse allowFocus={active}/>
            </div>
        );
    }

}