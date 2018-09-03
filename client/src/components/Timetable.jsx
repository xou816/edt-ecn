import React from 'react';
import {connect} from 'react-redux';
import {
    addDays,
    addHours,
    addMinutes,
    compareAsc,
    format,
    isEqual,
    isSameDay,
    parse,
    startOfDay,
    startOfWeek
} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {Divider, Typography, withStyles} from "@material-ui/core";
import {TimetableEntry} from "./TimetableEntry";
import {TimetableEvents} from "./TimetableEvents";
import {FocusedCourse} from "./FocusedCourse";

@connect(state => ({
    date: state.app.date,
    isPhone: state.responsive.isPhone,
    calendar: state.app.calendar,
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
        let rawDate = this.props.date;
        return this.days() > 1 ? startOfWeek(rawDate, {weekStartsOn: 1}) : startOfDay(rawDate);
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

    renderSeparators() {
        return Array.from({length: 10}, (x, i) => (
            <Divider key={`sep_${i}`} style={{gridRow: `${4 * i + 2} / span 4`, gridColumn: '1 / span 5'}}/>
        ));
    }

    renderDays() {
        return Array.from({length: this.days()}, (x, i) => {
            let date = addDays(this.date(), i);
            let today = isSameDay(date, Date.now());
            let formatted = format(date, 'dddd Do MMMM', {locale: frLocale});
            return (
                <Typography align="center" color={today ? 'primary' : 'textSecondary'} key={formatted}
                            style={{gridColumn: i + 1, gridRow: '1 / span 1'}}>
                    {formatted.toUpperCase()}
                </Typography>
            )
        });
    }

    renderMarker() {
        let now = Date.now();
        return !this.isVisible(now) ? null : (
            <TimetableEntry event={{start: now, end: addMinutes(now, 15)}} offset={this.offset()}>
                <Divider className={this.props.classes.now}/>
            </TimetableEntry>
        );
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                {this.renderSeparators()}
                {this.renderDays()}
                <TimetableEvents offset={this.offset()} days={this.days()}/>
                {this.renderMarker()}
                <FocusedCourse/>
            </div>

        );
    }

}