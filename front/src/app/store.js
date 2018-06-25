import thunk from "redux-thunk";
import {appReducer} from "./reducers";
import {mediaQueryTracker, reducer as responsive} from "redux-mediaquery";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";

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

export default store;