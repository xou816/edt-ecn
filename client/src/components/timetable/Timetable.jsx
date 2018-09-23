import React from 'react';
import {
    addDays,
    addHours,
    addMinutes,
    addWeeks,
    format,
    isFriday,
    isMonday,
    isSameDay,
    startOfDay,
    startOfWeek,
    subDays,
    subWeeks
} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {Divider, Typography, withStyles} from "@material-ui/core";
import {TimetableEntry} from "./TimetableEntry";
import {TimetableEvents} from "./TimetableEvents";
import {FocusedCourse} from "./FocusedCourse";
import Swipeable from 'react-swipeable';
import {withRouter} from 'react-router';

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

function Marker({classes, offset}) {
    let now = Date.now();
    return (<TimetableEntry event={{start: now, end: addMinutes(now, 15)}} offset={offset}>
        <Divider className={classes.now}/>
    </TimetableEntry>);
}


@withRouter
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

    date() {
        let {date, days} = this.props;
        return days > 1 ? startOfWeek(date, {weekStartsOn: 1}) : startOfDay(date);
    }

    links() {
        let {days, date, makeLink} = this.props;
        let next, prev;
        if (days === 1) {
            next = addDays(date, isFriday(date) ? 3 : 1);
            prev = subDays(date, isMonday(date) ? 3 : 1);
        } else {
            next = addWeeks(date, 1);
            prev = subWeeks(date, 1);
        }
        return {prev: makeLink(prev), next: makeLink(next)};
    }

    isVisible(date) {
        let {days} = this.props;
        let offset = this.offset();
        return date >= offset && date < addDays(offset, days);
    }

    offset() {
        let now = new Date();
        let offset = now.getTimezoneOffset() / -60;
        return addHours(this.date(), 8 + offset - 2).valueOf();
    }

    render() {
        let {classes, days, history} = this.props;
        let {prev, next} = this.links();
        return (
            <Swipeable onSwipedRight={() => history.push(prev)}
                       onSwipedLeft={() => history.push(next)}
                       className={classes.root}>
                <Hours classes={classes}/>
                <Separators days={days}/>
                <Days length={days} date={this.date()}/>
                <TimetableEvents offset={this.offset()} days={days}/>
                {this.isVisible(Date.now()) ?
                    <Marker offset={this.offset()} classes={classes}/> : null}
                <FocusedCourse/>
            </Swipeable>
        );
    }

}