import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {App} from "./components/App";
import store from "./app/store";
import {updateStore} from "./app/routing";

updateStore();

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('react_root'));