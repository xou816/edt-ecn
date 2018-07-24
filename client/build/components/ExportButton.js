"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExportButton = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@material-ui/core");

var _ContentCopy = require("@material-ui/icons/ContentCopy");

var _ContentCopy2 = _interopRequireDefault(_ContentCopy);

var _reactRedux = require("react-redux");

var _copyToClipboard = require("copy-to-clipboard");

var _copyToClipboard2 = _interopRequireDefault(_copyToClipboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExportButton = exports.ExportButton = (_dec = (0, _reactRedux.connect)(function (state) {
    return {
        calendar: state.app.calendar
    };
}), _dec2 = (0, _core.withStyles)(function (theme) {
    return {
        btn: {
            position: 'fixed',
            bottom: theme.spacing.unit,
            right: theme.spacing.unit
        },
        avatar: {
            backgroundColor: 'inherit'
        },
        margin: {
            margin: theme.spacing.unit + "px " + 3 * theme.spacing.unit + "px"
        },
        copyright: {
            margin: 2 * theme.spacing.unit,
            textAlign: 'center'
        }
    };
}), _dec(_class = _dec2(_class = function (_React$Component) {
    _inherits(ExportButton, _React$Component);

    function ExportButton(props) {
        _classCallCheck(this, ExportButton);

        var _this = _possibleConstructorReturn(this, (ExportButton.__proto__ || Object.getPrototypeOf(ExportButton)).call(this, props));

        _this.state = {
            showDialog: false
        };
        return _this;
    }

    _createClass(ExportButton, [{
        key: "disabled",
        value: function disabled() {
            return this.props.calendar === null;
        }
    }, {
        key: "link",
        value: function link() {
            return "/api/calendar/custom/" + this.props.calendar + ".ics";
        }
    }, {
        key: "copy",
        value: function copy() {
            (0, _copyToClipboard2.default)(this.link());
        }
    }, {
        key: "toggleDialog",
        value: function toggleDialog() {
            var _this2 = this;

            return !this.disabled() ? function () {
                return _this2.setState({ showDialog: !_this2.state.showDialog });
            } : function () {};
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                _react2.default.Fragment,
                null,
                _react2.default.createElement(
                    _core.Button,
                    { disabled: this.disabled(), onClick: this.toggleDialog(), variant: "fab", color: "secondary",
                        className: this.props.classes.btn },
                    _react2.default.createElement(
                        _core.Avatar,
                        { className: this.props.classes.avatar },
                        "ICS"
                    )
                ),
                _react2.default.createElement(
                    _core.Dialog,
                    { open: this.state.showDialog, onClose: this.toggleDialog() },
                    _react2.default.createElement(
                        _core.DialogTitle,
                        null,
                        "Lien ICS"
                    ),
                    _react2.default.createElement(
                        _core.Typography,
                        { className: this.props.classes.margin },
                        "Copiez ce lien dans votre application de calendrier pr\xE9f\xE9r\xE9e."
                    ),
                    _react2.default.createElement(_core.TextField, { value: this.link(), className: this.props.classes.margin, InputProps: {
                            endAdornment: _react2.default.createElement(
                                _core.InputAdornment,
                                { position: "end" },
                                _react2.default.createElement(
                                    _core.IconButton,
                                    { onClick: function onClick() {
                                            return _this3.copy();
                                        } },
                                    _react2.default.createElement(_ContentCopy2.default, null)
                                )
                            )
                        } }),
                    _react2.default.createElement(
                        "div",
                        { className: this.props.classes.copyright },
                        _react2.default.createElement(
                            _core.Typography,
                            { color: "textSecondary" },
                            "Cr\xE9\xE9 par Alexandre Trendel"
                        ),
                        _react2.default.createElement(
                            _core.Button,
                            { color: "secondary", href: "https://github.com/xou816/edt-ecn" },
                            "Github"
                        )
                    )
                )
            );
        }
    }]);

    return ExportButton;
}(_react2.default.Component)) || _class) || _class);