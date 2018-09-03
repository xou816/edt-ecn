import React from 'react';
import {connect} from 'react-redux';
import {addDays, addHours, addMinutes, format, isSameDay, startOfDay, startOfWeek} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {Divider, Typography, withStyles} from "@material-ui/core";
import {TimetableEntry} from "./TimetableEntry";
import {TimetableEvents} from "./TimetableEvents";
import {FocusedCourse} from "./FocusedCourse";

function Separators() {
    return (
        Array.from({length: 10}, (x, i) => (
            <Divider key={`sep_${i}`} style={{gridRow: `${4 * i + 2} / span 4`, gridColumn: '1 / span 5'}}/>
        ))

    );
}

function Days({length, date}) {
    return (
        Array.from({length}, (x, i) => {
            let curDate = addDays(date, i);
            let today = isSameDay(curDate, Date.now());
            let formatted = format(curDate, 'dddd Do MMMM', {locale: frLocale});
            return (
                <Typography align="center" color={today ? 'primary' : 'textSecondary'} key={formatted}
                            style={{gridColumn: i + 1, gridRow: '1 / span 1'}}>
                    {formatted.toUpperCase()}
                </Typography>
            )
        })
    );
}

function Marker({classes, offset}) {
    let now = Date.now();
    return (<TimetableEntry event={{start: now, end: addMinutes(now, 15)}} offset={offset}>
        <Divider className={classes.now}/>
    </TimetableEntry>);
}

@connect(state => ({
    isPhone: state.responsive.isPhone,
}))
@withStyles(theme => ({
    root: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(40, .7em)',
        gridGap: '.4em .4em',
        margin: '1em',
        [theme.breakpoints.down(767)]: {
            gridTemplateColumns: '1fr',
            gridGap: '.4em 0'
        }
    },
    now: {
        width: '100%',
        backgroundColor: theme.palette.secondary.main,
        height: '2px'
    }
}))
export class Timetable extends React.Component {

    days() {
        return this.props.isPhone ? 1 : 5;
    }

    date() {
        let {date} = this.props;
        return this.days() > 1 ? startOfWeek(date, {weekStartsOn: 1}) : startOfDay(date);
    }

    isVisible(date) {
        let offset = this.offset();
        return date >= offset && date < addDays(offset, this.days());
    }

    offset() {
        let now = new Date();
        let offset = now.getTimezoneOffset() / -60;
        return addHours(this.date(), 8 + offset - 2).valueOf();
    }


    render() {
        let {classes} = this.props;
        return (
            <div className={classes.root}>
                <Separators/>
                <Days length={this.days()} date={this.date()}/>
                <TimetableEvents offset={this.offset()} days={this.days()}/>
                {this.isVisible(Date.now()) ? <Marker offset={this.offset()} classes={classes}/> : null}
                <FocusedCourse/>
            </div>
        );
    }

}