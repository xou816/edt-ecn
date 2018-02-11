import {Router, Response, Request} from "express";
import {createStore} from "redux";
import {Provider} from "react-redux";
import {renderToString} from "react-dom/server";
import {createElement} from "react";
import {readFile} from "fs";
import {join} from 'path';

function readManifest(): Promise<{js: string, css: string}> {
    return new Promise((resolve, reject) => {
        readFile('../public/asset-manifest.json', 'utf8', (err, data) => {
            if (err) reject();
            let manifest = JSON.parse(data);
            resolve({
                js: manifest['main.css'],
                css: manifest['main.js']
            });
        });
    });
}

// import {App} from "../front";
// currently this would not work
// i would need to transpile part of the frontend for use at runtime by the backend
function isomorphicRenderer(res: Response, req: Request): Promise<void> {
    const store = createStore((state, action) => state);
    const rendered = renderToString(createElement(Provider, {store}, [])); // createElement(App)
    const state = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
    const preloadScript = `window.__PRELOADED_STATE__ = ${state};`;
    return readManifest()
        .then(manifest => res.render('react', {
            ...manifest,
            preloadScript,
            rendered
        }));
}

export default function reactRouter(router: Router): Router {

    router.use((req, res) => {
        readFile(join(__dirname, '../public/index.html'), 'utf8', (err, data) => {
            res.send(data);
        });
    });

    return router;
}