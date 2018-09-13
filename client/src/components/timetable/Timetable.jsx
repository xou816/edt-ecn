import React from 'react';
import {addDays, addHours, addMinutes, format, isSameDay, startOfDay, startOfWeek} from "date-fns";
import frLocale from "date-fns/locale/fr";
import {Divider, withStyles, Button} from "@material-ui/core";
import {TimetableEntry} from "./TimetableEntry";
import {TimetableEvents} from "./TimetableEvents";
import {FocusedCourse} from "./FocusedCourse";
import {toggleMenu} from "../../app/actions";
import {connect} from 'react-redux';

function Separators() {
    return (
        Array.from({length: 12}, (x, i) => (
            <Divider key={`sep_${i}`} style={{gridRow: `${4 * i + 2} / span 4`, gridColumn: '1 / span 5'}}/>
        ))

    );
}

function Days({length, date, onClick}) {
    return (
        Array.from({length}, (x, i) => {
            let curDate = addDays(date, i);
            let today = isSameDay(curDate, Date.now());
            let formatted = format(curDate, 'ddd Do MMM', {locale: frLocale});
            return (
                <Button onClick={onClick} color={today ? 'primary' : 'default'} key={formatted} style={{gridColumn: i + 1, gridRow: '1 / span 1', minHeight: '20px', paddingTop: 0}}>
                    {formatted.toUpperCase()}
                </Button>
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


@connect(null, dispatch => ({toggle: () => dispatch(toggleMenu())}))
@withStyles(theme => ({
    root: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(45, .7em)',
        gridGap: '.4em .4em',
        margin: '1em',
        flex: '1',
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

    date() {
        let {date, days} = this.props;
        return days > 1 ? startOfWeek(date, {weekStartsOn: 1}) : startOfDay(date);
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
        let {classes, days, toggle} = this.props;
        return (
            <div className={classes.root}>
                <Separators/>
                <Days onClick={toggle} length={days} date={this.date()}/>
                <TimetableEvents offset={this.offset()} days={days}/>
                {this.isVisible(Date.now()) ? <Marker offset={this.offset()} classes={classes}/> : null}
                <FocusedCourse/>
            </div>
        );
    }

}