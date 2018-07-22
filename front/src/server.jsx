import path from 'path';
import fs from 'fs';
import {parse} from 'url';
import Express from 'express';
import proxy from 'express-http-proxy';
import React from 'react';
import {Provider} from 'react-redux';
import {App} from './components/App';
import {getCalendar} from './app/actions';
import thunk from "redux-thunk";
import {renderToString} from 'react-dom/server';
import {appReducer} from "./app/reducers";
import {updateStore} from "./app/routing";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {SheetsRegistry} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider, createMuiTheme, createGenerateClassName} from '@material-ui/core/styles';
import {createMemoryHistory} from "history";

function responsive(state, action) {
	return {isPhone: false, ...state};
}

function createServerStore(history) {
	return createStore(combineReducers({
    	app: appReducer,
    	responsive
	}), applyMiddleware(thunk.withExtraArgument({history})));
}

const renderPage = (html, css, state) => new Promise((resolve, reject) => {
	fs.readFile(path.resolve(__dirname, '../build/public/asset-manifest.json'), 'utf8', (err, data) => {
		if (err) {
			reject(err);
		}
		let pathToBundle = path.join('/public', JSON.parse(data)['main.js']);
		let preloaded = JSON.stringify(state).replace(/</g, '\\u003c');
		resolve(`
			<!DOCTYPE html>
			<html>
			  <head>
			    <meta charset="UTF-8">
			    <meta name="viewport" content="width=device-width" />
			    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
			    <title>Emploi du temps</title>
			  </head>
			  <body>
			    <div id="react_root">${html}</div>
			    <script>
	          	window.__PRELOADED_STATE__ = ${preloaded};
	        	</script>
	        	<style id="jss-server-side">${css}</style>
	        	<script src="${pathToBundle}"></script>
			  </body>
			</html>
		`);
	});
});

const app = Express();
const port = 3003;

app.use('/public', Express.static(path.resolve(__dirname, '../build/public')));
app.use('/api', proxy('localhost:3000', {
	proxyReqPathResolver: req => path.join('/api', parse(req.url).path)
}));

app.use((req, res) => {
	const path = parse(req.url).path;
	const history = createMemoryHistory();
	const store = createServerStore(history);
	const generateClassName = createGenerateClassName();
	const sheetsRegistry = new SheetsRegistry();
	const theme = createMuiTheme();
	updateStore(store.dispatch, history, {pathname: path})
		.then(_ => store.dispatch(getCalendar()))
		.then(_ => {
			const html = renderToString(
				<Provider store={store}>
					 <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
					 	<MuiThemeProvider theme={theme} sheetsManager={new Map()}>
					 		<App />
					 	</MuiThemeProvider>
					 </JssProvider>
				</Provider>
			);
			const css = sheetsRegistry.toString();
			return renderPage(html, css, store.getState())
		})
		.then(result => res.send(result));
});

app.listen(port);