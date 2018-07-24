'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _url = require('url');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHttpProxy = require('express-http-proxy');

var _expressHttpProxy2 = _interopRequireDefault(_expressHttpProxy);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _App = require('./components/App');

var _server = require('react-dom/server');

var _store = require('./app/store');

var _jss = require('react-jss/lib/jss');

var _JssProvider = require('react-jss/lib/JssProvider');

var _JssProvider2 = _interopRequireDefault(_JssProvider);

var _styles = require('@material-ui/core/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderPage = function renderPage(html, css, state) {
	return new Promise(function (resolve, reject) {
		_fs2.default.readFile(_path2.default.resolve(__dirname, '../build/public/asset-manifest.json'), 'utf8', function (err, data) {
			if (err) {
				reject(err);
			}
			var pathToBundle = _path2.default.join('/public', JSON.parse(data)['main.js']);
			var preloaded = JSON.stringify(state).replace(/</g, '\\u003c');
			resolve('\n\t\t\t<!DOCTYPE html>\n\t\t\t<html>\n\t\t\t  <head>\n\t\t\t    <meta charset="UTF-8">\n\t\t\t    <meta name="viewport" content="width=device-width" />\n\t\t\t    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">\n\t\t\t    <title>Emploi du temps</title>\n\t\t\t  </head>\n\t\t\t  <body>\n\t\t\t    <div id="react_root">' + html + '</div>\n\t\t\t    <script>\n\t          \twindow.__PRELOADED_STATE__ = ' + preloaded + ';\n\t        \t</script>\n\t        \t<style id="jss-server-side">' + css + '</style>\n\t        \t<script src="' + pathToBundle + '"></script>\n\t\t\t  </body>\n\t\t\t</html>\n\t\t');
		});
	});
};

var app = (0, _express2.default)();

app.use((0, _compression2.default)());
app.use('/public', _express2.default.static(_path2.default.resolve(__dirname, '../build/public')));
app.use('/api', (0, _expressHttpProxy2.default)('localhost:' + ((process.env.PORT || 3000) + 1), {
	proxyReqPathResolver: function proxyReqPathResolver(req) {
		return _path2.default.join('/api', (0, _url.parse)(req.url).path);
	}
}));

app.use(function (req, res) {
	var path = (0, _url.parse)(req.url).path;
	var generateClassName = (0, _styles.createGenerateClassName)();
	var sheetsRegistry = new _jss.SheetsRegistry();
	var theme = (0, _styles.createMuiTheme)();
	(0, _store.createServerStore)(path).then(function (store) {
		var html = (0, _server.renderToString)(_react2.default.createElement(
			_reactRedux.Provider,
			{ store: store },
			_react2.default.createElement(
				_JssProvider2.default,
				{ registry: sheetsRegistry, generateClassName: generateClassName },
				_react2.default.createElement(
					_styles.MuiThemeProvider,
					{ theme: theme, sheetsManager: new Map() },
					_react2.default.createElement(_App.App, null)
				)
			)
		));
		var css = sheetsRegistry.toString();
		return renderPage(html, css, store.getState());
	}).then(function (result) {
		return res.send(result);
	});
});

app.listen(process.env.PORT || 3000);