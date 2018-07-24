import thunk from "redux-thunk";
import {appReducer} from "./reducers";
import {mediaQueryTracker, reducer as responsive} from "redux-mediaquery";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {createBrowserHistory, createMemoryHistory} from "history";
import {updateStore} from "./routing";
import {parseIso} from './event';

export function createClientStore() {

	const history = createBrowserHistory();

	let initialState = {};
	if (window.__PRELOADED_STATE__) {
		initialState = {...window.__PRELOADED_STATE__};
		initialState.app.events = window.__PRELOADED_STATE__.app.events.map(e => ({
			...e,
			start: parseIso(e.start),
			end: parseIso(e.end)
		}));
	}

	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = createStore(combineReducers({
	    responsive,
	    app: appReducer
	}), initialState, composeEnhancers(applyMiddleware(thunk.withExtraArgument({history}))));

	mediaQueryTracker({
	    isPhone: "screen and (max-width: 767px)",
	    innerWidth: true,
	    innerHeight: true,
	}, store.dispatch);

	// history.listen(location => updateStore(store.dispatch, history, location));
	// updateStore(store.dispatch, history);

	return store;
}

export function createServerStore(path, isPhone) {

	const history = createMemoryHistory();

	const store = createStore(combineReducers({
    	app: appReducer,
    	responsive: (state, action) => ({isPhone: isPhone})
	}), applyMiddleware(thunk.withExtraArgument({history})));

	return updateStore(store.dispatch, history, {pathname: path})
		.then(_ => store);
} 