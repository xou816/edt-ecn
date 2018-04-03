import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {appReducer} from './app/reducers';
import createHistory from "history/createHashHistory";
import {mediaQueryTracker, reducer as responsive} from 'redux-mediaquery';

import {App} from "./components/App";
import {getCalendar, getCalendarList} from "./app/actions";
import {routerMiddleware, routerReducer} from "react-router-redux";

export const history = createHistory();
const store = createStore(combineReducers({
    responsive,
    app: appReducer,
    routing: routerReducer
}), applyMiddleware(thunk, routerMiddleware(history)));

mediaQueryTracker({
    isPhone: "screen and (max-width: 767px)",
    innerWidth: true,
    innerHeight: true,
}, store.dispatch);

store.dispatch(getCalendarList());
store.dispatch(getCalendar(history.location.pathname.substring(1)));

history.listen(location => {
    store.dispatch(getCalendar(location.pathname.substring(1)));
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('react_root'));