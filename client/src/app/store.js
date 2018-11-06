import thunk from "redux-thunk";
import {appReducer} from "./reducers";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {parseIso} from './event';
import {
    createResponsiveStateReducer,
    createResponsiveStoreEnhancer,
    responsiveStateReducer,
    responsiveStoreEnhancer
} from "redux-responsive";

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
        app: appReducer,
        browser: responsiveStateReducer,
    }), initialState, composeEnhancers(responsiveStoreEnhancer, applyMiddleware(thunk)));
}

export function createServerStore(mediaType) {
    const browser = createResponsiveStateReducer(null, {initialMediaType: mediaType});
    const enhancer = createResponsiveStoreEnhancer({calculateInitialState: false});
    return createStore(combineReducers({
        app: appReducer,
        browser
    }), compose(enhancer, applyMiddleware(thunk)));
} 