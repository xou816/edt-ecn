import path from 'path';
import fs from 'fs';
import {parse} from 'url';
import Express from 'express';
import proxy from 'express-http-proxy';
import compression from 'compression';
import React from 'react';
import {Provider} from 'react-redux';
import {App} from './components/App';
import {renderToString} from 'react-dom/server';
import {createServerStore} from "./app/store";
import {SheetsRegistry} from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import {MuiThemeProvider, createMuiTheme, createGenerateClassName} from '@material-ui/core/styles';

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

app.use(compression());
app.use('/public', Express.static(path.resolve(__dirname, '../build/public')));
app.use('/api', proxy(`localhost:${(process.env.PORT || 3000) + 1}`, {
	proxyReqPathResolver: req => path.join('/api', parse(req.url).path)
}));

app.use((req, res) => {
	const path = parse(req.url).path;
	const generateClassName = createGenerateClassName();
	const sheetsRegistry = new SheetsRegistry();
	const theme = createMuiTheme();
	createServerStore(path)
		.then(store => {
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

app.listen(process.env.PORT || 3000);