"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Nav = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _actions = require("../app/actions");

var _reactRedux = require("react-redux");

var _core = require("@material-ui/core");

var _Menu = require("@material-ui/icons/Menu");

var _Menu2 = _interopRequireDefault(_Menu);

var _KeyboardArrowRight = require("@material-ui/icons/KeyboardArrowRight");

var _KeyboardArrowRight2 = _interopRequireDefault(_KeyboardArrowRight);

var _KeyboardArrowLeft = require("@material-ui/icons/KeyboardArrowLeft");

var _KeyboardArrowLeft2 = _interopRequireDefault(_KeyboardArrowLeft);

var _DatePicker = require("material-ui-pickers/DatePicker");

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _dateFnsUtils = require("material-ui-pickers/utils/date-fns-utils");

var _dateFnsUtils2 = _interopRequireDefault(_dateFnsUtils);

var _MuiPickersUtilsProvider = require("material-ui-pickers/utils/MuiPickersUtilsProvider");

var _MuiPickersUtilsProvider2 = _interopRequireDefault(_MuiPickersUtilsProvider);

var _fr = require("date-fns/locale/fr");

var _fr2 = _interopRequireDefault(_fr);

var _dateFns = require("date-fns");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateDisplay = function DateDisplay(props) {
    var doFormat = function doFormat(d) {
        return (0, _dateFns.format)(d, 'Do MMMM', { locale: _fr2.default });
    };
    var date = props.isPhone ? doFormat(props.date) : "Semaine du " + doFormat((0, _dateFns.startOfWeek)(props.date, { weekStartsOn: 1 }));
    return React.createElement(
        _core.Button,
        { onClick: props.onClick, color: "inherit", variant: "flat" },
        date
    );
};

var mapState = function mapState(state) {
    return {
        date: state.app.date,
        isPhone: state.responsive.isPhone,
        menu: state.app.menu
    };
};

var mapDispatch = function mapDispatch(dispatch) {
    return {
        next: function next() {
            return dispatch((0, _actions.next)());
        },
        prev: function prev() {
            return dispatch((0, _actions.prev)());
        },
        setDate: function setDate(date) {
            return dispatch((0, _actions.setDate)(date));
        },
        toggleMenu: function toggleMenu() {
            return dispatch((0, _actions.toggleMenu)());
        }
    };
};

var Nav = exports.Nav = (_dec = (0, _reactRedux.connect)(mapState, mapDispatch), _dec2 = (0, _core.withStyles)(function (theme) {
    return {
        toolbar: {
            display: 'flex'
        },
        spread: {
            flexGrow: 1
        },
        appbar: {
            position: 'sticky !important',
            top: 0
        },
        btn: {
            marginLeft: 2
        }
    };
}), _dec(_class = _dec2(_class = function (_React$Component) {
    _inherits(Nav, _React$Component);

    function Nav() {
        _classCallCheck(this, Nav);

        return _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).apply(this, arguments));
    }

    _createClass(Nav, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var classes = this.props.classes;
            return React.createElement(
                _core.AppBar,
                { className: classes.appbar, position: "static" },
                React.createElement(
                    _core.Toolbar,
                    { className: classes.toolbar },
                    React.createElement(
                        _core.IconButton,
                        { color: "inherit", onClick: function onClick() {
                                return _this2.props.toggleMenu();
                            }, "aria-label": "menu" },
                        React.createElement(_Menu2.default, null)
                    ),
                    React.createElement(
                        _MuiPickersUtilsProvider2.default,
                        { utils: _dateFnsUtils2.default, locale: _fr2.default },
                        React.createElement(_DatePicker2.default, {
                            cancelLabel: 'Annuler',
                            rightArrowIcon: React.createElement(_KeyboardArrowRight2.default, null),
                            leftArrowIcon: React.createElement(_KeyboardArrowLeft2.default, null),
                            showTodayButton: true,
                            todayLabel: 'Aujourd\'hui',
                            format: 'L',
                            autoOk: true,
                            onChange: this.props.setDate,
                            TextFieldComponent: function TextFieldComponent(props) {
                                return React.createElement(DateDisplay, _extends({}, props, {
                                    isPhone: _this2.props.isPhone,
                                    date: _this2.props.date }));
                            } })
                    ),
                    React.createElement("div", { className: classes.spread }),
                    this.props.isPhone ? null : [React.createElement(
                        _core.Button,
                        { className: classes.btn, key: "left", variant: "raised", color: "secondary",
                            onClick: function onClick() {
                                return _this2.props.prev();
                            } },
                        "Pr\xE9c."
                    ), React.createElement(
                        _core.Button,
                        { className: classes.btn, key: "right", variant: "raised", color: "secondary",
                            onClick: function onClick() {
                                return _this2.props.next();
                            } },
                        "Suiv."
                    )]
                )
            );
        }
    }]);

    return Nav;
}(React.Component)) || _class) || _class);