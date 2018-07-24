"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Course = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dec, _class;

var _format = require("date-fns/format");

var _format2 = _interopRequireDefault(_format);

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _event = require("../app/event");

var _core = require("@material-ui/core");

var _colors = require("../app/colors");

var _AccessTime = require("@material-ui/icons/AccessTime");

var _AccessTime2 = _interopRequireDefault(_AccessTime);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function CourseSummary(_ref) {
    var event = _ref.event,
        long = _ref.long,
        classes = _ref.classes;

    return long ? [React.createElement(
        _core.Typography,
        { key: "title", variant: "title", component: "h2", color: "inherit" },
        (event.category + " " + event.subject).trim()
    ), React.createElement(
        _core.Typography,
        { className: classes.par, key: "subheading", variant: "subheading", component: "h3", color: "inherit" },
        "(",
        event.full_subject,
        ")"
    )] : React.createElement(
        _core.Typography,
        { className: classes.par, variant: "subheading", component: "h2", color: "inherit" },
        (event.category + " " + event.subject).trim()
    );
}

function displaySpan(event) {
    var start = (0, _format2.default)(event.start, 'H:mm');
    var end = (0, _format2.default)(event.end, 'H:mm');
    return start + "h - " + end + "h";
}

function CourseDetails(_ref2) {
    var event = _ref2.event,
        long = _ref2.long,
        classes = _ref2.classes;

    return React.createElement(
        React.Fragment,
        null,
        !long ? null : React.createElement(
            React.Fragment,
            null,
            React.createElement(
                _core.Typography,
                { component: "p", color: "inherit" },
                event.description
            ),
            React.createElement(
                _core.Typography,
                { component: "p", color: "inherit" },
                "Intervenant : ",
                event.organizer || 'non spécifié'
            )
        ),
        React.createElement(_AccessTime2.default, { className: classes.icon }),
        React.createElement(
            _core.Typography,
            { className: classes.icon, component: "span", color: "inherit" },
            displaySpan(event)
        ),
        React.createElement(
            "div",
            { className: classes.par },
            event.location.length === 0 ? null : event.location.split(',').map(function (l) {
                return React.createElement(_core.Chip, { className: classes.chip, key: l, label: l });
            })
        )
    );
}

var Course = exports.Course = (_dec = (0, _core.withStyles)(function (theme) {
    return _extends({
        root: {
            height: '100%',
            flexGrow: 1,
            overflow: 'hidden'
        },
        par: {
            marginBottom: .5 * theme.spacing.unit
        },
        icon: {
            verticalAlign: 'middle',
            display: 'inline',
            margin: .5 * theme.spacing.unit + "px 0",
            paddingRight: theme.spacing.unit
        },
        chip: {
            margin: 2
        }
    }, _colors.COLOR_CLASSES);
}), _dec(_class = function (_React$Component) {
    _inherits(Course, _React$Component);

    function Course() {
        _classCallCheck(this, Course);

        return _possibleConstructorReturn(this, (Course.__proto__ || Object.getPrototypeOf(Course)).apply(this, arguments));
    }

    _createClass(Course, [{
        key: "className",
        value: function className() {
            return this.props.classes.root + ' ' + this.props.classes["color" + (0, _event.subjectId)(this.props) % 10];
        }
    }, {
        key: "ifLarge",
        value: function ifLarge(expr) {
            return this.props.long || this.props.end.valueOf() - this.props.start.valueOf() > 5 * 1000 * 60 * 15 ? expr : null;
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                long = _props.long,
                colour = _props.colour;

            return React.createElement(
                _core.Card,
                { className: this.className() },
                React.createElement(
                    _core.CardContent,
                    { className: this.className(), style: { backgroundColor: colour } },
                    React.createElement(CourseSummary, { long: long, classes: this.props.classes, event: this.props }),
                    this.ifLarge(React.createElement(CourseDetails, { long: long, classes: this.props.classes, event: this.props }))
                )
            );
        }
    }]);

    return Course;
}(React.Component)) || _class);