"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Sidebar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@material-ui/core");

var _reactRedux = require("react-redux");

var _actions = require("../app/actions");

var _CalendarSelect = require("./CalendarSelect");

var _FilterSubject = require("./FilterSubject");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mapState = function mapState(state) {
    return {
        shown: state.app.menu,
        loading: state.app.loading
    };
};

var mapDispatch = function mapDispatch(dispatch) {
    return {
        complete: function complete() {
            dispatch((0, _actions.applySelection)()).then(function (_) {
                return dispatch((0, _actions.toggleMenu)());
            });
        },
        getSubjects: function getSubjects() {
            return dispatch((0, _actions.getSubjects)());
        }
    };
};

var Sidebar = exports.Sidebar = (_dec = (0, _reactRedux.connect)(mapState, mapDispatch), _dec2 = (0, _core.withStyles)(function (theme) {
    return {
        close: {
            position: 'sticky',
            top: 0,
            backgroundColor: theme.palette.background.paper,
            zIndex: 9000,
            textAlign: 'center'
        },
        closeBtn: {
            width: '100%'
        },
        root: _defineProperty({
            width: '35%'
        }, theme.breakpoints.down(767), {
            width: '100%'
        })
    };
}), _dec(_class = _dec2(_class = function (_React$Component) {
    _inherits(Sidebar, _React$Component);

    function Sidebar(props) {
        _classCallCheck(this, Sidebar);

        var _this = _possibleConstructorReturn(this, (Sidebar.__proto__ || Object.getPrototypeOf(Sidebar)).call(this, props));

        _this.state = {
            step: 0
        };
        return _this;
    }

    _createClass(Sidebar, [{
        key: "next",
        value: function next(callback) {
            var _this2 = this;

            return function () {
                var then = function then() {
                    return _this2.setState({ step: _this2.state.step + 1 });
                };
                callback != null ? callback().then(then) : then();
            };
        }
    }, {
        key: "prev",
        value: function prev() {
            var _this3 = this;

            return function () {
                return _this3.setState({ step: _this3.state.step - 1 });
            };
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                _core.Drawer,
                { classes: { paper: this.props.classes.root }, open: this.props.shown, onClose: this.props.complete },
                _react2.default.createElement(
                    "div",
                    { className: this.props.classes.close },
                    _react2.default.createElement(
                        _core.Button,
                        { onClick: this.props.complete, color: "primary", className: this.props.classes.closeBtn },
                        "Fermer"
                    ),
                    this.props.loading ? _react2.default.createElement(_core.LinearProgress, null) : _react2.default.createElement(_core.Divider, null)
                ),
                _react2.default.createElement(
                    _core.Stepper,
                    { activeStep: this.state.step, orientation: "vertical" },
                    _react2.default.createElement(
                        _core.Step,
                        null,
                        _react2.default.createElement(
                            _core.StepLabel,
                            null,
                            "Choisir des calendriers"
                        ),
                        _react2.default.createElement(
                            _core.StepContent,
                            null,
                            _react2.default.createElement(_CalendarSelect.CalendarSelect, null),
                            _react2.default.createElement(
                                _core.Button,
                                { onClick: this.next(), variant: "raised",
                                    color: "primary" },
                                "Suivant"
                            )
                        )
                    ),
                    _react2.default.createElement(
                        _core.Step,
                        null,
                        _react2.default.createElement(
                            _core.StepLabel,
                            null,
                            "Filtrer les mati\xE8res"
                        ),
                        _react2.default.createElement(
                            _core.StepContent,
                            null,
                            _react2.default.createElement(_FilterSubject.FilterSubject, null),
                            _react2.default.createElement(
                                _core.Button,
                                { onClick: this.prev(), variant: "raised" },
                                "Pr\xE9c\xE9dent"
                            ),
                            ' ',
                            _react2.default.createElement(
                                _core.Button,
                                { onClick: this.props.complete, variant: "raised", color: "primary" },
                                "Terminer"
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Sidebar;
}(_react2.default.Component)) || _class) || _class);