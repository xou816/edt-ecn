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
import {Divider, withStyles, Button, Typography} from "@material-ui/core";
import {TimetableEntry} from "./TimetableEntry";
import {TimetableEvents} from "./TimetableEvents";
import {FocusedCourse} from "./FocusedCourse";
import {toggleMenu} from "../../app/actions";
import {connect} from 'react-redux';
import Swipeable from 'react-swipeable';
import {withRouter} from 'react-router';
import {Link} from "react-router-dom";
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

function Separators({days}) {
    return (
        Array.from({length: 12}, (x, i) => (
            <Divider key={`sep_${i}`} style={{gridRow: `${4 * i + 2} / span 4`, gridColumn: `2 / span ${days}`}}/>
        ))

    );
}

function Days({length, date, classes}) {
    return (
        Array.from({length}, (x, i) => {
            let curDate = addDays(date, i);
            let today = isSameDay(curDate, Date.now());
            let formatted = format(curDate, 'ddd Do MMM', {locale: frLocale});
            return (
                <Typography align="center" color={today ? 'primary' : 'textSecondary'} key={formatted}
                            style={{gridColumn: i + 2, gridRow: '1 / span 1'}}>
                    {formatted.toUpperCase()}
                </Typography>
            )
        })
    );
}

function NavButtons({days, prev, next, classes}) {
    return [
        <Button component={Link} key="left" to={prev} size="small" className={classes.btn} color="primary"
                style={{gridColumn: 1, gridRow: 1}}>
            <KeyboardArrowLeft/>
        </Button>,
        <Button component={Link} key="right" to={next} size="small" className={classes.btn} color="primary"
                style={{gridColumn: days + 2, gridRow: 1}}>
            <KeyboardArrowRight/>
        </Button>
    ]
}

function Marker({classes, offset}) {
    let now = Date.now();
    return (<TimetableEntry event={{start: now, end: addMinutes(now, 15)}} offset={offset}>
        <Divider className={classes.now}/>
    </TimetableEntry>);
}


@withRouter
@connect(null, dispatch => ({toggle: () => dispatch(toggleMenu())}))
@withStyles(theme => ({
    root: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '2em repeat(5, 1fr) 2em',
        gridTemplateRows: '1em repeat(45, .7em)',
        gridGap: '.4em .4em',
        padding: '1em 0',
        flex: '1',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down(767)]: {
            gridTemplateColumns: '2em 1fr 2em',
            gridGap: '.4em 0'
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
        let {classes, days, toggle, history} = this.props;
        let {prev, next} = this.links();
        return (
            <Swipeable onSwipedRight={() => history.push(prev)}
                       onSwipedLeft={() => history.push(next)}
                       className={classes.root}>
                <Separators days={days}/>
                <NavButtons classes={classes} days={days} prev={prev} next={next}/>
                <Days classes={classes} onClick={toggle} length={days} date={this.date()}/>
                <TimetableEvents offset={this.offset()} days={days}/>
                {this.isVisible(Date.now()) ?
                    <Marker offset={this.offset()} classes={classes}/> : null}
                <FocusedCourse/>
            </Swipeable>
        );
    }

}