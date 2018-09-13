import React from 'react';
import {Timetable} from "./Timetable";
import Swipeable from 'react-swipeable';
import {TimetableNav} from "./TimetableNav";
import {connect} from "react-redux";
import {LinearProgress, withStyles} from "@material-ui/core";
import {getCalendar} from "../../app/actions";
import {addDays, addWeeks, format, isFriday, isMonday, parse, subDays, subWeeks, startOfDay, isSameDay} from "date-fns";
import {compile} from "path-to-regexp";
import {withRouter} from "react-router";
import DatePickerDrawer from "./DatePickerDrawer";
import Media from "react-media";

const mapState = state => ({
    loading: state.app.loading
});

const mapDispatch = dispatch => ({
    getCalendar: calendar => dispatch(getCalendar(calendar))
});

function makeLink(match) {
    let compiled = compile(match.path);
    return date => compiled({
        ...match.params,
        date: isSameDay(date, Date.now()) ?
            'today' :
            format(date, 'YYYYMMDD')
    });
}

@withRouter
@withStyles(theme => ({
    root: {
        display: 'flex'
    }
}))
@connect(mapState, mapDispatch)
export class TimetablePage extends React.Component {

    get calendar() {
        return this.props.match.params.calendar;
    }

    get date() {
        let date = this.props.match.params.date;
        return date !== 'today' ?
            parse(date, 'YYYYMMDD', Date.now()) :
            startOfDay(Date.now());
    }

    links(isPhone) {
        let {match} = this.props;
        let current = this.date;
        let make = makeLink(match);
        let next, prev;
        if (isPhone) {
            next = addDays(current, isFriday(current) ? 3 : 1);
            prev = subDays(current, isMonday(current) ? 3 : 1);
        } else {
            next = addWeeks(current, 1);
            prev = subWeeks(current, 1);
        }
        return {
            prev: make(prev),
            next: make(next)
        };
    }

    componentDidMount() {
        let {getCalendar} = this.props;
        getCalendar(this.calendar);
    }

    render() {
        let date = this.date;
        let {loading, history, classes, match} = this.props;
        return (
            <Media query={{screen: true, maxWidth: '797px'}}>
                {isPhone => {
                    let {prev, next} = this.links(isPhone);
                    return <Swipeable
                        onSwipedRight={() => history.push(prev)}
                        onSwipedLeft={() => history.push(next)}>
                        <TimetableNav date={date} next={next} prev={prev}/>
                        {loading ? <LinearProgress/> : null}
                        <Media query={{maxWidth: '1024px', minWidth: '767px'}}>
                            {isTablet =>
                                <div className={classes.root}>
                                    <DatePickerDrawer permanent={!isPhone && !isTablet} makeLink={makeLink(match)} date={date}/>
                                    <Timetable days={isPhone? 1 : 5} date={date}/>
                                </div>
                            }
                        </Media>
                    </Swipeable>
                }}
            </Media>
        );
    }
}