import path from 'path';
import {readFile} from 'fs';
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
import {createGenerateClassName, MuiThemeProvider} from '@material-ui/core/styles';
import {UAParser} from 'ua-parser-js';
import {MediaProvider} from "./components/Media";
import {StaticRouter} from "react-router";
import {theme} from "./app/theme";
import CleanCss from 'clean-css';

const cleanCss = new CleanCss({returnPromise: true});

const pathToBundle = () => new Promise((resolve, reject) => {
    readFile(path.resolve(__dirname, '../build/public/asset-manifest.json'), 'utf8', (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(path.join('/public', JSON.parse(data)['main.js']));
        }
    });
});

function renderPage(html, css, js, state) {
    let preloaded = JSON.stringify(state).replace(/</g, '\\u003c');
    return `<!DOCTYPE html>
		<html>
		<head>
	        <meta charset="UTF-8">
			<meta name="viewport" content="width=device-width" />
			<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">
			<title>Emploi du temps</title>
	    </head>
	    <body>
	        <div id="react_root">${html}</div>
			<script>window.__PRELOADED_STATE__ = ${preloaded};</script>
	        <style id="jss-server-side">${css}</style>
	        <script src="${js}"></script>
	    </body>
		</html>`;
}

function storeReady(store) {
    setTimeout(() => store.dispatch({type: '__WAKE_SUBSCRIBER__'}), 10); // needed if no dispatch occurs when rendering
    return new Promise((resolve) => {
        store.subscribe(() => {
            const state = store.getState();
            if (!state.app.loading) {
                resolve(state);
            }
        })
    });
}

const app = Express();

app.use(compression());
app.use('/public', Express.static(path.resolve(__dirname, '../build/public')));
app.use('/api', proxy(`localhost:${parseInt(process.env.PORT || '3000', 10) + 1}`, {
    proxyReqPathResolver: req => path.join('/api', parse(req.url).path)
}));

app.use((req, res) => {
    const context = {};
    const generateClassName = createGenerateClassName();
    const sheetsRegistry = new SheetsRegistry();
    const store = createServerStore();
    const deviceType = UAParser(req.header('user-agent')).device.type;
    const html = renderToString(
        <MediaProvider value={deviceType}>
            <Provider store={store}>
                <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                    <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                        <StaticRouter location={req.url} context={context}>
                            <App/>
                        </StaticRouter>
                    </MuiThemeProvider>
                </JssProvider>
            </Provider>
        </MediaProvider>
    );
    cleanCss.minify(sheetsRegistry.toString())
        .then(css => css.styles)
        .then(css => pathToBundle().then(js => ({js, css})))
        .then(data => storeReady(store).then(state => ({...data, state})))
        .then(({css, js, state}) => renderPage(html, css, js, state))
        .then(result => res.send(result));
});

app.listen(process.env.PORT || 3000);