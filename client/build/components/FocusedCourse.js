"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FocusedCourse = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _core = require("@material-ui/core");

var _Course = require("./Course");

var _actions = require("../app/actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FocusedCourse = exports.FocusedCourse = (_dec = (0, _reactRedux.connect)(function (state) {
    return {
        focus: state.app.focus,
        events: state.app.events
    };
}, function (dispatch) {
    return {
        blur: function blur() {
            return dispatch((0, _actions.blurEvent)());
        }
    };
}), _dec(_class = function (_React$Component) {
    _inherits(FocusedCourse, _React$Component);

    function FocusedCourse() {
        _classCallCheck(this, FocusedCourse);

        return _possibleConstructorReturn(this, (FocusedCourse.__proto__ || Object.getPrototypeOf(FocusedCourse)).apply(this, arguments));
    }

    _createClass(FocusedCourse, [{
        key: "event",
        value: function event() {
            var _this2 = this;

            return this.props.events.find(function (e) {
                return e.id === _this2.props.focus;
            });
        }
    }, {
        key: "open",
        value: function open() {
            return this.props.focus != null;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                _core.Dialog,
                { fullWidth: true, open: this.open(), onClose: function onClose() {
                        return _this3.props.blur();
                    } },
                !this.open() ? '' : _react2.default.createElement(_Course.Course, _extends({ long: true }, this.event()))
            );
        }
    }]);

    return FocusedCourse;
}(_react2.default.Component)) || _class);