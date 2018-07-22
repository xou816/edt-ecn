import thunk from "redux-thunk";
import {appReducer} from "./reducers";
import {mediaQueryTracker, reducer as responsive} from "redux-mediaquery";
import {applyMiddleware, combineReducers, compose, createStore as reduxCreateStore} from "redux";
import {createBrowserHistory} from "history";
import {updateStore} from "./routing";
import {parseIso} from './event';

export default function createStore(preloaded) {

	const history = createBrowserHistory();

	preloaded.app.events = preloaded.app.events.map(e => ({
		...e,
		start: parseIso(e.start),
		end: parseIso(e.end)
	}));

	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
	const store = reduxCreateStore(combineReducers({
	    responsive,
	    app: appReducer
	}), preloaded, composeEnhancers(applyMiddleware(thunk.withExtraArgument({history}))));

	mediaQueryTracker({
	    isPhone: "screen and (max-width: 767px)",
	    innerWidth: true,
	    innerHeight: true,
	}, store.dispatch);

	history.listen(location => updateStore(store.dispatch, history, location));
	updateStore(store.dispatch, history);

	return store;
}