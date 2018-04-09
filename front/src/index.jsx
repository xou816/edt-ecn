import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {appReducer} from './app/reducers';
import createHistory from "history/createHashHistory";
import {mediaQueryTracker, reducer as responsive} from 'redux-mediaquery';

import {App} from "./components/App";
import {setCalendar} from "./app/actions";

export const history = createHistory();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(combineReducers({
    responsive,
    app: appReducer
}), composeEnhancers(applyMiddleware(thunk)));

mediaQueryTracker({
    isPhone: "screen and (max-width: 767px)",
    innerWidth: true,
    innerHeight: true,
}, store.dispatch);

let cal = history.location.pathname.substring(1);
if (cal.length > 0) store.dispatch(setCalendar(cal));

history.listen(location => {
    let cal = location.pathname.substring(1);
    if (cal.length > 0) store.dispatch(setCalendar(cal));
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('react_root'));