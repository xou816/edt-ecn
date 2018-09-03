import {compile, default as parsePath} from "path-to-regexp";
import {format, isSameDay, parse, setHours} from "date-fns";

import {setCalendar, setDate} from "./actions";

const route = '/:calendar?/:date?';

export function updateStore(dispatch, history, location) {
    location = location || history.location;
    let promises = [];
    let parsed = parsePath(route).exec(location.pathname);
    if (parsed) {
        let calendar = parsed[1];
        let date = setHours(parse(parsed[2], 'YYYYMMDD', Date.now()), 12);
        if (calendar && calendar.length > 0) {
            promises.push(dispatch(setCalendar(calendar)));
        }
        if (date && !isNaN(date.getTime())) {
            promises.push(dispatch(setDate(date)));
        }
    }
    return Promise.all(promises);
}

export function updateHistory(history, args) {
    let compiled = compile(route);
    let current = parsePath(route).exec(history.location.pathname);
    if (args.date) {
        args.date = isSameDay(args.date, Date.now()) ? 'today' : format(args.date, 'YYYYMMDD');
    }
    let final = {
        calendar: current[1],
        date: current[2],
        ...args,
    };
    history.push(final.calendar === null ? '/' : compiled(final));
}