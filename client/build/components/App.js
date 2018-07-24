'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Timetable = require('./Timetable');

var _reactSwipeable = require('react-swipeable');

var _reactSwipeable2 = _interopRequireDefault(_reactSwipeable);

var _Nav = require('./Nav');

var _actions = require('../app/actions');

var _reactRedux = require('react-redux');

var _core = require('@material-ui/core');

var _Sidebar = require('./Sidebar');

var _ExportButton = require('./ExportButton');

var _Help = require('@material-ui/icons/Help');

var _Help2 = _interopRequireDefault(_Help);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapState = function mapState(state) {
    return {
        loading: state.app.loading,
        calendarReady: state.app.calendar !== null,
        error: state.app.error
    };
};

var mapDispatch = function mapDispatch(dispatch) {
    return {
        next: function next() {
            return dispatch((0, _actions.next)());
        },
        prev: function prev() {
            return dispatch((0, _actions.prev)());
        }
    };
};

var App = exports.App = (_dec = (0, _reactRedux.connect)(mapState, mapDispatch), _dec2 = (0, _core.withStyles)(function (theme) {
    return {
        caption: {
            fontSize: '1em',
            margin: '3em 1em'
        },
        icon: {
            fontSize: '3em'
        }
    };
}), _dec(_class = _dec2(_class = function (_React$Component) {
    _inherits(App, _React$Component);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var jssStyles = document.getElementById('jss-server-side');
            if (jssStyles && jssStyles.parentNode) {
                jssStyles.parentNode.removeChild(jssStyles);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                next = _props.next,
                prev = _props.prev,
                loading = _props.loading,
                calendarReady = _props.calendarReady,
                classes = _props.classes,
                error = _props.error;

            return React.createElement(
                React.Fragment,
                null,
                React.createElement(_core.CssBaseline, null),
                React.createElement(
                    _reactSwipeable2.default,
                    { onSwipedLeft: function onSwipedLeft() {
                            return next();
                        }, onSwipedRight: function onSwipedRight() {
                            return prev();
                        } },
                    React.createElement(_Nav.Nav, null),
                    loading ? React.createElement(_core.LinearProgress, null) : null,
                    calendarReady ? React.createElement(_Timetable.Timetable, null) : React.createElement(
                        _core.Typography,
                        { className: classes.caption, align: 'center', paragraph: true, component: 'p', variant: 'caption', color: 'textSecondary' },
                        React.createElement(_Help2.default, { className: classes.icon }),
                        React.createElement('br', null),
                        'Ouvrez le menu pour s\xE9lectionner un calendrier.'
                    )
                ),
                React.createElement(_Sidebar.Sidebar, null),
                calendarReady ? React.createElement(_ExportButton.ExportButton, null) : null,
                React.createElement(_core.Snackbar, { open: error !== null, message: error, autoHideDuration: 3000 })
            );
        }
    }]);

    return App;
}(React.Component)) || _class) || _class);