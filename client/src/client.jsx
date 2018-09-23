import * as React from 'react';
import {hydrate} from 'react-dom';
import {Provider} from 'react-redux';

import {App} from "./components/App";
import {MediaProvider} from "./components/Media";
import {createClientStore} from "./app/store";
import {BrowserRouter} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from './app/theme';

const clientApp = (
    <MediaProvider value={null}>
        <Provider store={createClientStore()}>
            <MuiThemeProvider theme={theme}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </MuiThemeProvider>
        </Provider>
    </MediaProvider>
);

hydrate(clientApp, document.getElementById('react_root'));