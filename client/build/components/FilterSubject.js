"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FilterSubject = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _core = require("@material-ui/core");

var _Visibility = require("@material-ui/icons/Visibility");

var _Visibility2 = _interopRequireDefault(_Visibility);

var _VisibilityOff = require("@material-ui/icons/VisibilityOff");

var _VisibilityOff2 = _interopRequireDefault(_VisibilityOff);

var _actions = require("../app/actions");

var _NestedList = require("./NestedList");

var _meta = require("../app/meta");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var mapState = function mapState(state) {
    return {
        subjects: state.app.subjects,
        list: state.app.list,
        calendars: (0, _meta.getCalendars)(state.app.meta),
        count: (0, _meta.countSubjects)(state.app.meta),
        checked: (0, _meta.includesSubject)(state.app.meta)
    };
};

var mapDispatch = function mapDispatch(dispatch) {
    return {
        toggleSubject: function toggleSubject(calendar, subject) {
            return dispatch((0, _actions.toggleSubject)(calendar, subject));
        },
        reset: function reset() {
            return dispatch((0, _actions.resetSubjects)());
        },
        getSubjects: function getSubjects() {
            return dispatch((0, _actions.getSubjects)());
        }
    };
};

var FilterSubject = exports.FilterSubject = (_dec = (0, _reactRedux.connect)(mapState, mapDispatch), _dec2 = (0, _core.withStyles)(function (theme) {
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
    _inherits(FilterSubject, _React$Component);

    function FilterSubject(props) {
        _classCallCheck(this, FilterSubject);

        var _this = _possibleConstructorReturn(this, (FilterSubject.__proto__ || Object.getPrototypeOf(FilterSubject)).call(this, props));

        _this.state = {
            unfold: null
        };
        return _this;
    }

    _createClass(FilterSubject, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            if (Object.keys(this.props.subjects).length === 0) {
                this.props.getSubjects();
            }
        }
    }, {
        key: "toggleCalendar",
        value: function toggleCalendar(cal) {
            this.setState({
                unfold: this.state.unfold === cal ? null : cal
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                classes = _props.classes,
                count = _props.count,
                toggleSubject = _props.toggleSubject,
                _checked = _props.checked,
                reset = _props.reset,
                subjects = _props.subjects,
                list = _props.list;

            var s = count > 1 ? 's' : '';
            return _react2.default.createElement(
                _core.List,
                { component: "nav", subheader: _react2.default.createElement(
                        _core.ListSubheader,
                        { onClick: reset, className: classes.root, component: "div" },
                        _react2.default.createElement(_core.Checkbox, { checked: count > 0, disableRipple: true }),
                        _react2.default.createElement(
                            _core.Typography,
                            { component: "h2", variant: "subheading", className: classes.title },
                            count,
                            " mati\xE8re",
                            s,
                            " filtr\xE9e",
                            s
                        )
                    ) },
                Object.keys(subjects).map(function (calendar) {
                    return _react2.default.createElement(_NestedList.NestedList, {
                        key: calendar,
                        title: list.find(function (cal) {
                            return cal.id === calendar;
                        }).display,
                        nested: subjects[calendar].sort(function (a, b) {
                            return a.name < b.name ? -1 : 1;
                        }),
                        shown: _this2.state.unfold === calendar,
                        unfold: function unfold() {
                            return _this2.toggleCalendar(calendar);
                        },
                        toggle: function toggle(subject) {
                            return toggleSubject(calendar, subject);
                        },
                        checked: function checked(subject) {
                            return _checked(calendar, subject);
                        },
                        getId: function getId(subject) {
                            return subject.id;
                        },
                        getDisplay: function getDisplay(subject) {
                            return subject.name;
                        },
                        checkbox: {
                            icon: _react2.default.createElement(_Visibility2.default, null),
                            checkedIcon: _react2.default.createElement(_VisibilityOff2.default, null)
                        }
                    });
                })
            );
        }
    }]);

    return FilterSubject;
}(_react2.default.Component)) || _class) || _class);