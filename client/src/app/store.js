import thunk from "redux-thunk";
import {appReducer} from "./reducers";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {parseIso} from './event';

export function createClientStore() {

    let initialState = {};
    if (window.__PRELOADED_STATE__) {
        initialState = {...window.__PRELOADED_STATE__};
        initialState.app.events = window.__PRELOADED_STATE__.app.events.map(e => ({
            ...e,
            start: parseIso(e.start),
            end: parseIso(e.end)
        }));
        initialState.app.date = parseIso(window.__PRELOADED_STATE__.app.date);
        delete window.__PRELOADED_STATE__;
    }

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(combineReducers({
        app: appReducer
    }), initialState, composeEnhancers(applyMiddleware(thunk)));
}

export function createServerStore() {

    return createStore(combineReducers({
        app: appReducer,
    }), applyMiddleware(thunk));
} 