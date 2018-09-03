import * as React from 'react';
import {hydrate} from 'react-dom';
import {Provider} from 'react-redux';

import {App} from "./components/App";
import {createClientStore} from "./app/store";

hydrate(<Provider store={createClientStore()}><App/></Provider>, document.getElementById('react_root'));