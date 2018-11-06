import React from "react";
import {compile} from "path-to-regexp";
import {
    addDays,
    addWeeks,
    differenceInCalendarDays,
    differenceInCalendarISOWeeks,
    format,
    isSameDay,
    parse,
    setHours
} from "date-fns";
import {withRouter} from 'react-router';
import {connect} from "react-redux";

const TODAY = setHours(Date.now(), 12);
const FORMAT = 'uMMdd';

function dateFormat(date) {
    return isSameDay(date, TODAY) ?
        'today' :
        format(date, FORMAT);
}

function parseDate(date) {
    return date === 'today' ?
        TODAY :
        parse(date, FORMAT, TODAY);
}

function makeLink(match) {
    let compiled = compile(match.path);
    return date => compiled({
        ...match.params,
        date: dateFormat(date)
    }, {encode: (value, token) => value});
}

function navigateTo(history) {
    return date => history.push(dateFormat(date));
}

function atPosition(weekView) {
    return (pos) => {
        let newDate = weekView ?
            addWeeks(TODAY, pos) :
            addDays(TODAY, pos);
        return newDate;
    }
}

function next(weekView) {
    return date => atPosition(weekView)(position(date) + 1);
}

function prev(weekView) {
    return date => atPosition(weekView)(position(date) - 1);
}

function position(weekView) {
    return date => weekView ?
        differenceInCalendarISOWeeks(date, TODAY) :
        differenceInCalendarDays(date, TODAY);
}

const withWeekView = connect(({browser}) => ({weekView: browser.greaterThan.small}));

export default function(Component) {
    return withRouter(withWeekView(({history, match, weekView, ...others}) => {
        let date = parseDate(match.params.date);
        return <Component {...others}
                          navigateTo={navigateTo(history)}
                          date={date}
                          weekView={weekView}
                          next={next(weekView)}
                          prev={prev(weekView)}
                          position={position(weekView)}
                          atPosition={atPosition(weekView)}
                          calendar={match.params.calendar}
                          makeLink={makeLink(match)}/>;
    }));
}