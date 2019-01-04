import React from "react";
import {compile} from "path-to-regexp";
import {
    addDays,
    addWeeks,
    addMonths,
    differenceInCalendarDays,
    differenceInCalendarISOWeeks,
    differenceInCalendarMonths,
    format,
    isSameDay,
    isValid,
    parse,
    setHours
} from "date-fns";
import {withRouter} from 'react-router';
import {connect} from "react-redux";
import {setView, toggleView} from "../../app/actions";

const TODAY = setHours(Date.now(), 12);
const FORMAT = 'uMMdd';

export const View = {
    LIST: 10,
    TIMETABLE: 100,
    MOBILE: 1,
    DESKTOP: 0
};

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
    return date => {
        isValid(date) && history.push(dateFormat(date));
    }
}

function atPosition(view) {
    return (pos) => {
        if (view === (View.TIMETABLE | View.DESKTOP)) {
            return addWeeks(TODAY, pos);
        } else if (view === (View.TIMETABLE | View.MOBILE)) {
            return addDays(TODAY, pos);
        } else if ((view | View.LIST) > 0) {
            return addMonths(TODAY, pos);
        }
    }
}

function next(view) {
    return date => atPosition(view)(position(view)(date) + 1);
}

function prev(view) {
    return date => atPosition(view)(position(view)(date) - 1);
}

function position(view) {
    return date => {
        if (view === (View.TIMETABLE | View.DESKTOP)) {
            return differenceInCalendarISOWeeks(date, TODAY);
        } else if (view === (View.TIMETABLE | View.MOBILE)) {
            return differenceInCalendarDays(date, TODAY);
        } else if ((view | View.LIST) > 0) {
            return differenceInCalendarMonths(date, TODAY);
        }
    };
}


export default function(Component) {
    const connector = connect(
        ({app, browser}) => ({ view: app.view, mobile: browser.greaterThan.small ? View.DESKTOP : View.MOBILE }),
        dispatch => ({ toggleView: () => dispatch(toggleView()), setView: view => dispatch(setView(view)) })
    );
    return withRouter(connector(({history, match, view, mobile, toggleView, ...others}) => {
        const date = parseDate(match.params.date);
        const actualView = mobile | view;
        return <Component {...others}
                          navigateTo={navigateTo(history)}
                          date={date}
                          view={actualView}
                          toggleView={toggleView}
                          setView={setView}
                          next={next(actualView)}
                          prev={prev(actualView)}
                          position={position(actualView)}
                          atPosition={atPosition(actualView)}
                          calendar={match.params.calendar}
                          makeLink={makeLink(match)}/>;
    }));
}