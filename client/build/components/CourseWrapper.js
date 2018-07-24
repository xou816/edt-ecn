"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CourseWrapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _Course = require("./Course");

var _TimetableEntry = require("./TimetableEntry");

var _core = require("@material-ui/core");

var _actions = require("../app/actions");

var _reactRedux = require("react-redux");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CourseWrapper = exports.CourseWrapper = (_dec = (0, _reactRedux.connect)(null, function (dispatch) {
    return {
        focusEvent: function focusEvent(id) {
            return dispatch((0, _actions.focusEvent)(id));
        }
    };
}), _dec2 = (0, _core.withStyles)(function (theme) {
    return {
        btn: {
            position: 'absolute !important',
            bottom: '5px',
            zIndex: 3000
        },
        btnLeft: {
            left: '5px'
        },
        btnRight: {
            right: '5px'
        }
    };
}), _dec(_class = _dec2(_class = function (_React$Component) {
    _inherits(CourseWrapper, _React$Component);

    function CourseWrapper(props) {
        _classCallCheck(this, CourseWrapper);

        var _this = _possibleConstructorReturn(this, (CourseWrapper.__proto__ || Object.getPrototypeOf(CourseWrapper)).call(this, props));

        _this.state = {
            page: 0
        };
        return _this;
    }

    _createClass(CourseWrapper, [{
        key: "length",
        value: function length() {
            return this.props.events.length;
        }
    }, {
        key: "current",
        value: function current() {
            return this.props.events[this.state.page % this.length()];
        }
    }, {
        key: "largest",
        value: function largest() {
            var min = this.props.events.map(function (e) {
                return e.start;
            }).reduce(function (min, cur) {
                return cur < min ? cur : min;
            });
            var max = this.props.events.map(function (e) {
                return e.end;
            }).reduce(function (max, cur) {
                return cur > max ? cur : max;
            });
            return { start: min, end: max };
        }
    }, {
        key: "multipage",
        value: function multipage(expr, fallback) {
            return this.length() <= 1 ? fallback : expr;
        }
    }, {
        key: "prevPage",
        value: function prevPage(e) {
            this.setState({ page: (this.state.page + this.length() - 1) % this.length() });
            e.stopPropagation();
        }
    }, {
        key: "nextPage",
        value: function nextPage(e) {
            this.setState({ page: (this.state.page + 1) % this.length() });
            e.stopPropagation();
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                classes = _props.classes,
                focusEvent = _props.focusEvent;

            var curr = this.current();
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    _TimetableEntry.TimetableEntry,
                    { event: curr, offset: this.props.offset, onClick: function onClick() {
                            return focusEvent(curr.id);
                        } },
                    React.createElement(_Course.Course, curr)
                ),
                this.multipage(React.createElement(
                    _TimetableEntry.TimetableEntry,
                    { event: curr, offset: this.props.offset, onClick: function onClick() {
                            return focusEvent(curr.id);
                        } },
                    React.createElement(
                        _core.Button,
                        { mini: true, className: classes.btn + " " + classes.btnLeft,
                            onClick: function onClick(e) {
                                return _this2.prevPage(e);
                            }, variant: "fab", color: "primary", "aria-label": "prev" },
                        "\xAB"
                    ),
                    React.createElement(
                        _core.Button,
                        { mini: true, className: classes.btn + " " + classes.btnRight,
                            onClick: function onClick(e) {
                                return _this2.nextPage(e);
                            }, variant: "fab", color: "primary", "aria-label": "next" },
                        "\xBB"
                    )
                ))
            );
        }
    }]);

    return CourseWrapper;
}(React.Component)) || _class) || _class);