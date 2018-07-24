"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CalendarSelect = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _core = require("@material-ui/core");

var _actions = require("../app/actions");

var _reactRedux = require("react-redux");

var _NestedList = require("./NestedList");

var _meta = require("../app/meta");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PREFIXES = {
    'OD': 'Option disciplinaire',
    'EI': 'Cycle ingénieur',
    'AP': 'Cycle ingénieur apprenti',
    'BTP': 'BTP',
    'M1': 'Master 1',
    'M2': 'Master 2',
    'MECA': 'Filière mécanique',
    'OP': 'Option profesionnelle',
    'PROMO': 'Promo EI1',
    '': 'Autres'
};

function indexList(list) {
    return list.reduce(function (acc, calendar) {
        var prefix = Object.keys(PREFIXES).find(function (prefix) {
            return calendar.name.startsWith(prefix);
        });
        return _extends({}, acc, _defineProperty({}, prefix, (acc[prefix] || []).concat([calendar])));
    }, {});
}

var mapState = function mapState(state) {
    return {
        list: indexList(state.app.list),
        checked: (0, _meta.includesCalendar)(state.app.meta),
        count: state.app.meta.length
    };
};

var mapDispatch = function mapDispatch(dispatch) {
    return {
        toggle: function toggle(id) {
            return dispatch((0, _actions.toggleCalendar)(id));
        },
        resetCalendars: function resetCalendars() {
            return dispatch((0, _actions.resetCalendars)());
        },
        getList: function getList() {
            return dispatch((0, _actions.getCalendarList)());
        }
    };
};

var CalendarSelect = exports.CalendarSelect = (_dec = (0, _reactRedux.connect)(mapState, mapDispatch), _dec2 = (0, _core.withStyles)(function (theme) {
    return {
        root: {
            backgroundColor: theme.palette.background.paper,
            margin: '1px',
            display: 'flex'
        },
        title: {
            padding: 1.5 * theme.spacing.unit + "px",
            flexGrow: 1
        }
    };
}), _dec(_class = _dec2(_class = function (_React$Component) {
    _inherits(CalendarSelect, _React$Component);

    function CalendarSelect(props) {
        _classCallCheck(this, CalendarSelect);

        var _this = _possibleConstructorReturn(this, (CalendarSelect.__proto__ || Object.getPrototypeOf(CalendarSelect)).call(this, props));

        _this.state = {
            unfold: null
        };
        return _this;
    }

    _createClass(CalendarSelect, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            if (Object.keys(this.props.list).length === 0) {
                this.props.getList();
            }
        }
    }, {
        key: "togglePrefix",
        value: function togglePrefix(prefix) {
            this.setState({
                unfold: this.state.unfold === prefix ? null : prefix
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                resetCalendars = _props.resetCalendars,
                count = _props.count,
                list = _props.list,
                _toggle = _props.toggle,
                classes = _props.classes,
                checked = _props.checked;

            var s = count > 1 ? 's' : '';
            return _react2.default.createElement(
                _core.List,
                { component: "nav", subheader: _react2.default.createElement(
                        _core.ListSubheader,
                        { onClick: resetCalendars, className: classes.root, component: "div" },
                        _react2.default.createElement(_core.Checkbox, { checked: count > 0,
                            disableRipple: true }),
                        _react2.default.createElement(
                            _core.Typography,
                            { component: "h2", variant: "subheading", className: classes.title },
                            count,
                            " calendrier",
                            s,
                            " s\xE9lectionn\xE9",
                            s
                        )
                    ) },
                Object.keys(list).map(function (prefix) {
                    return _react2.default.createElement(_NestedList.NestedList, {
                        key: "prefix_" + prefix,
                        title: PREFIXES[prefix],
                        nested: list[prefix],
                        shown: _this2.state.unfold === prefix,
                        checked: checked,
                        toggle: function toggle(id) {
                            return _toggle(id);
                        },
                        unfold: function unfold() {
                            return _this2.togglePrefix(prefix);
                        },
                        getId: function getId(calendar) {
                            return calendar.id;
                        },
                        getDisplay: function getDisplay(calendar) {
                            return calendar.display;
                        }
                    });
                })
            );
        }
    }]);

    return CalendarSelect;
}(_react2.default.Component)) || _class) || _class);