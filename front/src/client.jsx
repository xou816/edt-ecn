import * as React from 'react';
import {hydrate} from 'react-dom';
import {Provider} from 'react-redux';

import {App} from "./components/App";
import createStore from "./app/store";

hydrate(<Provider store={createStore(window.__PRELOADED_STATE__)}><App /></Provider>, document.getElementById('react_root'));