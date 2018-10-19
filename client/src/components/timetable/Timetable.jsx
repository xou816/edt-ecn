import React from 'react';
import {addDays, addHours, addMinutes, format, getHours, isSameDay, startOfDay, startOfWeek} from "date-fns";
import {TimetableEntry} from "./TimetableEntry";
import {TimetableEvents} from "./TimetableEvents";
import {FocusedCourse} from "./FocusedCourse";
import Typography from "@material-ui/core/Typography/Typography";
import Divider from "@material-ui/core/Divider/Divider";
import withStyles from "@material-ui/core/styles/withStyles";
import NoSsr from "@material-ui/core/NoSsr/NoSsr";
import {TranslateDate} from "../Translation";

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
        return (
            <TranslateDate key={i}>{locale => (
                <Typography align="center"
                            color={today ? 'primary' : 'textSecondary'} key={i.toString()}
                            style={{gridColumn: i + 2, gridRow: '1 / span 1'}}>
                    {format(curDate, 'eee d MMM', {locale}).toUpperCase()}
                </Typography>
            )}</TranslateDate>
        )
    });
}

function Marker({offset, dayOffset, classes}) {
    let now = Date.now();
    return now >= dayOffset && now < addHours(dayOffset, 12) ? (
        <TimetableEntry event={{start: now, end: addMinutes(now, 15)}} offset={offset}>
            <Divider className={classes.now}/>
        </TimetableEntry>
    ) : <div/>;
}

function Today({dayOffset, offset, classes}) {
    return (
        <TimetableEntry event={{start: dayOffset, end: addHours(dayOffset, 11)}} offset={offset}>
            <div className={classes.bg}/>
        </TimetableEntry>
    );
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
    },
    bg: {
        background: theme.palette.grey[200],
        opacity: 0.5,
        display: 'block',
        height: '100%',
        width: '100%',
    }
}))
export class Timetable extends React.Component {

    get date() {
        let {date, days} = this.props;
        return days > 1 ? startOfWeek(date, {weekStartsOn: 1}) : startOfDay(date);
    }

    offset(date) {
        const offset = date.getTimezoneOffset() / -60;
        return addHours(startOfDay(date), 8 + offset - 2);
    }

    render() {
        let {classes, days, active, currDate} = this.props;
        const offset = this.offset(this.date);
        const dayOffset = this.offset(currDate);
        return (
            <div className={classes.root}>
                <NoSsr>{days > 1 && <Today dayOffset={dayOffset} offset={offset} classes={classes}/>}</NoSsr>
                <Hours classes={classes}/>
                <Days length={days} date={this.date}/>
                <Separators days={days}/>
                <TimetableEvents offset={offset} days={days}/>
                <NoSsr><Marker dayOffset={dayOffset} offset={offset} classes={classes}/></NoSsr>
                <FocusedCourse allowFocus={active}/>
            </div>
        );
    }

}