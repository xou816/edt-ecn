import React from 'react';
import {Timetable} from "./Timetable";
import Swipeable from 'react-swipeable';
import {TimetableNav} from "./TimetableNav";
import {connect} from "react-redux";
import {LinearProgress} from "@material-ui/core";
import {getCalendar} from "../../app/actions";
import {addDays, addWeeks, format, isFriday, isMonday, parse, subDays, subWeeks} from "date-fns";
import {compile} from "path-to-regexp";
import {withRouter} from "react-router";

const mapState = state => ({
    loading: state.app.loading,
    isPhone: state.responsive.isPhone
});

const mapDispatch = dispatch => ({
    getCalendar: calendar => dispatch(getCalendar(calendar))
});

function makeLink(match) {
    let compiled = compile(match.path);
    return date => compiled({...match.params, date: format(date, 'YYYYMMDD')});
}

@withRouter
@connect(mapState, mapDispatch)
export class TimetablePage extends React.Component {

    get calendar() {
        return this.props.match.params.calendar;
    }

    get date() {
        let date = this.props.match.params.date;
        return date !== 'today' ?
            parse(date, 'YYYYMMDD', Date.now()) :
            Date.now();
    }

    links() {
        let {match, isPhone} = this.props;
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
        let {prev, next} = this.links();
        let {loading, history} = this.props;
        return (
            <Swipeable
                onSwipedRight={() => history.push(prev)}
                onSwipedLeft={() => history.push(next)}>
                <TimetableNav date={date} next={next} prev={prev}/>
                {loading ? <LinearProgress/> : null}
                <Timetable date={date}/>
            </Swipeable>
        );
    }
}