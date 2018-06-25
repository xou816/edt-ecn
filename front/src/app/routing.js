import {createHashHistory} from "history";
import {default as parsePath, compile} from "path-to-regexp";
import {format, parse} from "date-fns";

import store from "./store";
import {setCalendar, setDate} from "./actions";

const route = '/:calendar?/:date?';
const history = createHashHistory();

export function updateStore(location) {
    location = location || history.location;
    let parsed = parsePath(route).exec(location.pathname);
    let calendar = parsed[1];
    let date = parse(parsed[2], 'YYYYMMDD', Date.now());
    if (calendar && calendar.length > 0) {
        store.dispatch(setCalendar(calendar));
    }
    if (date && !isNaN(date.getTime())) {
        store.dispatch(setDate(date));
    }
}

export function updateHistory(args) {
    let compiled = compile(route);
    let current = parsePath(route).exec(history.location.pathname);
    if (args.date) {
        args.date = format(args.date, 'YYYYMMDD');
    }
    let final = {
        calendar: current[1],
        date: current[2],
        ...args,
    };
    history.push(final.calendar === null ? '/' : compiled(final));
}

history.listen(updateStore);
