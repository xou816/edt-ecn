import * as React from 'react';
import {hydrate} from 'react-dom';
import {Provider} from 'react-redux';

import {App} from "./components/App";
import {MediaProvider} from "./components/Media";
import {createClientStore} from "./app/store";
import {BrowserRouter} from "react-router-dom";

const clientApp = (
    <MediaProvider value={null}>
        <Provider store={createClientStore()}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </MediaProvider>
);

hydrate(clientApp, document.getElementById('react_root'));