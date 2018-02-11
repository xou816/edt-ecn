import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {appReducer} from './app/reducers';
import createHistory from "history/createHashHistory";
import {reducer as responsive, mediaQueryTracker} from 'redux-mediaquery';

import './index.scss';
import {App} from "./components/App";
import {getCalendar} from "./app/actions";

const store = createStore(combineReducers({responsive, app: appReducer}), applyMiddleware(thunk));

mediaQueryTracker({
    isPhone: "screen and (max-width: 767px)",
    innerWidth: true,
    innerHeight: true,
}, store.dispatch);

const history = createHistory();
store.dispatch(getCalendar(history.location.pathname.substring(1)));

history.listen((location, action) => {
    if (location.pathname.length > 1) {
        store.dispatch(getCalendar(location.pathname.substring(1)));
    }
});

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('react_root'));