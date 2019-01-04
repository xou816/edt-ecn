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
import {JssProvider, SheetsRegistry} from 'react-jss';
import {createGenerateClassName, MuiThemeProvider} from '@material-ui/core/styles';
import {UAParser} from 'ua-parser-js';
import {StaticRouter} from "react-router";
import {theme} from "./app/theme";
import CleanCss from 'clean-css';
import {CookiesProvider} from 'react-cookie';
import Cookies from "universal-cookie/cjs/Cookies";
import cookiesMiddleware from "universal-cookie-express";
import {createHash} from 'crypto';
import {setView} from "./app/actions";
import {View} from "./components/timetable/timeviewAware";

const cleanCss = new CleanCss({returnPromise: true});

const pathToBundle = () => new Promise((resolve, reject) => {
    readFile(path.resolve(__dirname, '../build/public/asset-manifest.json'), 'utf8', (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(JSON.parse(data));
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
			<meta name="theme-color" content="${theme.palette.primary.main}">
            <link rel="manifest" href="/public/manifest.json">
            <link rel="shortcut icon" href="/public/favicon.ico">
			<title>Emploi du temps</title>
	    </head>
	    <body>
	        <div id="react_root">${html}</div>
			<script>window.__PRELOADED_STATE__ = ${preloaded};</script>
	        <style id="jss-server-side">${css}</style>
	        <script src="${js['main.js']}"></script>
	        <script src="${js['vendors.js']}"></script>
	    </body>
		</html>`;
}

function mapDeviceToMedia(device) {
    switch (device) {
        case 'mobile':
            return 'small';
        case 'tablet':
            return 'small';
        default:
            return 'large';
    }
}

function log(req, obj) {
    const ip = (req.header('x-forwarded-for') || req.connection.remoteAddress).split(',').pop();
    const ua = req.header('user-agent');
    const lang = req.universalCookies.get('language');
    const path = parse(req.url).path;
    const id = createHash('md5').update(ip+ua).digest('hex').substring(0, 10);
    const full = {
        id,
        ...obj,
        ip, ua, lang, path
    };
    console.log(JSON.stringify(full));
    return full;
}

function storeReady(store, timeout) {
    setTimeout(() => store.dispatch({type: '__WAKE_SUBSCRIBER__'}), 10); // needed if no dispatch occurs when rendering
    setTimeout(() => store.dispatch({type: 'LOAD_END'}), timeout);
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
app.use(cookiesMiddleware());

app.use((req, res, next) => {
    if (process.env.IS_HEROKU === 'true' && req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        return next();
    }
});

app.use('/public', Express.static(path.resolve(__dirname, '../build/public')));

app.use('/api', proxy(`localhost:${parseInt(process.env.PORT || '3000', 10) + 1}`, {
    proxyReqPathResolver: req => path.join('/api', parse(req.url).path),
    userResDecorator: (res, resData, req) => {
        log(req, {proxied: true});
        return resData;
    }
}));

// needs to be served at the root
app.get('/service-worker.js', (req, res) => {
    log(req, {proxied: true});
    res.sendFile(path.resolve(__dirname, '../build/public/service-worker.js'));
});

app.use((req, res) => {
    const context = {};
    const cookies = new Cookies(req.headers.cookie);
    const generateClassName = createGenerateClassName();
    const sheetsRegistry = new SheetsRegistry();
    const deviceType = UAParser(req.header('user-agent')).device.type || 'unknown';
    const store = createServerStore(mapDeviceToMedia(deviceType));
    store.dispatch(setView(parseInt(cookies.get('view') || View.TIMETABLE, 10)));
    const html = renderToString(
        <Provider store={store}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                    <StaticRouter location={req.url} context={context}>
                        <CookiesProvider cookies={cookies}>
                            <App/>
                        </CookiesProvider>
                    </StaticRouter>
                </MuiThemeProvider>
            </JssProvider>
        </Provider>
    );
    cleanCss.minify(sheetsRegistry.toString())
        .then(css => css.styles)
        .then(css => pathToBundle().then(js => ({js, css})))
        .then(data => Promise.resolve(store.getState()).then(state => ({...data, state})))
        .then(({css, js, state}) => renderPage(html, css, js, state))
        .then(result => res.send(result));
    log(req, {deviceType, proxied: false});
});

app.listen(process.env.PORT || 3000);