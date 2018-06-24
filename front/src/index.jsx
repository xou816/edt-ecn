import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {appReducer} from './app/reducers';
import {mediaQueryTracker, reducer as responsive} from 'redux-mediaquery';
import {HashRouter as Router, Route} from "react-router-dom";

import {App} from "./components/App";
import {setCalendar} from "./app/actions";

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

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Route path="/:calendar?" component={App} />
		</Router>
	</Provider>, document.getElementById('react_root'));