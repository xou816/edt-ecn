"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createClientStore = createClientStore;
exports.createServerStore = createServerStore;

var _reduxThunk = require("redux-thunk");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require("./reducers");

var _reduxMediaquery = require("redux-mediaquery");

var _redux = require("redux");

var _history = require("history");

var _routing = require("./routing");

var _event = require("./event");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createClientStore() {

	var history = (0, _history.createBrowserHistory)();

	var initialState = {};
	if (window.__PRELOADED_STATE__) {
		initialState = _extends({}, window.__PRELOADED_STATE__);
		initialState.app.events = window.__PRELOADED_STATE__.app.events.map(function (e) {
			return _extends({}, e, {
				start: (0, _event.parseIso)(e.start),
				end: (0, _event.parseIso)(e.end)
			});
		});
	}

	var composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || _redux.compose;
	var store = (0, _redux.createStore)((0, _redux.combineReducers)({
		responsive: _reduxMediaquery.reducer,
		app: _reducers.appReducer
	}), initialState, composeEnhancers((0, _redux.applyMiddleware)(_reduxThunk2.default.withExtraArgument({ history: history }))));

	(0, _reduxMediaquery.mediaQueryTracker)({
		isPhone: "screen and (max-width: 767px)",
		innerWidth: true,
		innerHeight: true
	}, store.dispatch);

	// history.listen(location => updateStore(store.dispatch, history, location));
	// updateStore(store.dispatch, history);

	return store;
}

function createServerStore(path) {

	var history = (0, _history.createMemoryHistory)();

	var store = (0, _redux.createStore)((0, _redux.combineReducers)({
		app: _reducers.appReducer,
		responsive: function responsive(state, action) {
			return { isPhone: false };
		}
	}), (0, _redux.applyMiddleware)(_reduxThunk2.default.withExtraArgument({ history: history })));

	return (0, _routing.updateStore)(store.dispatch, history, { pathname: path }).then(function (_) {
		return store;
	});
}