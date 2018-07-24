'use strict';

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var _reactRedux = require('react-redux');

var _App = require('./components/App');

var _store = require('./app/store');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _reactDom.hydrate)(React.createElement(
  _reactRedux.Provider,
  { store: (0, _store.createClientStore)() },
  React.createElement(_App.App, null)
), document.getElementById('react_root'));