'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Timetable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactRedux = require('react-redux');

var _dateFns = require('date-fns');

var _fr = require('date-fns/locale/fr');

var _fr2 = _interopRequireDefault(_fr);

var _core = require('@material-ui/core');

var _TimetableEntry = require('./TimetableEntry');

var _TimetableEvents = require('./TimetableEvents');

var _FocusedCourse = require('./FocusedCourse');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Timetable = exports.Timetable = (_dec = (0, _reactRedux.connect)(function (state) {
    return {
        date: state.app.date,
        isPhone: state.responsive.isPhone,
        calendar: state.app.calendar
    };
}), _dec2 = (0, _core.withStyles)(function (theme) {
    return {
        root: _defineProperty({
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: 'repeat(40, .7em)',
            gridGap: '.4em .4em',
            margin: '1em'
        }, theme.breakpoints.down(767), {
            gridTemplateColumns: '1fr',
            gridGap: '.4em 0'
        }),
        now: {
            width: '100%',
            backgroundColor: theme.palette.secondary.main,
            height: '2px'
        }
    };
}), _dec(_class = _dec2(_class = function (_React$Component) {
    _inherits(Timetable, _React$Component);

    function Timetable() {
        _classCallCheck(this, Timetable);

        return _possibleConstructorReturn(this, (Timetable.__proto__ || Object.getPrototypeOf(Timetable)).apply(this, arguments));
    }

    _createClass(Timetable, [{
        key: 'days',
        value: function days() {
            return this.props.isPhone ? 1 : 5;
        }
    }, {
        key: 'date',
        value: function date() {
            var rawDate = this.props.date;
            return this.days() > 1 ? (0, _dateFns.startOfWeek)(rawDate, { weekStartsOn: 1 }) : (0, _dateFns.startOfDay)(rawDate);
        }
    }, {
        key: 'isVisible',
        value: function isVisible(date) {
            var offset = this.offset();
            return date >= offset && date < (0, _dateFns.addDays)(offset, this.days());
        }
    }, {
        key: 'offset',
        value: function offset() {
            var now = new Date();
            var offset = now.getTimezoneOffset() / -60;
            return (0, _dateFns.addHours)(this.date(), 8 + offset - 2).valueOf();
        }
    }, {
        key: 'renderSeparators',
        value: function renderSeparators() {
            return Array.from({ length: 10 }, function (x, i) {
                return React.createElement(_core.Divider, { key: 'sep_' + i, style: { gridRow: 4 * i + 2 + ' / span 4', gridColumn: '1 / span 5' } });
            });
        }
    }, {
        key: 'renderDays',
        value: function renderDays() {
            var _this2 = this;

            return Array.from({ length: this.days() }, function (x, i) {
                var date = (0, _dateFns.addDays)(_this2.date(), i);
                var today = (0, _dateFns.isSameDay)(date, Date.now());
                var formatted = (0, _dateFns.format)(date, 'dddd Do MMMM', { locale: _fr2.default });
                return React.createElement(
                    _core.Typography,
                    { align: 'center', color: today ? 'primary' : 'textSecondary', key: formatted,
                        style: { gridColumn: i + 1, gridRow: '1 / span 1' } },
                    formatted.toUpperCase()
                );
            });
        }
    }, {
        key: 'renderMarker',
        value: function renderMarker() {
            var now = Date.now();
            return !this.isVisible(now) ? null : React.createElement(
                _TimetableEntry.TimetableEntry,
                { event: { start: now, end: (0, _dateFns.addMinutes)(now, 15) }, offset: this.offset() },
                React.createElement(_core.Divider, { className: this.props.classes.now })
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: this.props.classes.root },
                this.renderSeparators(),
                this.renderDays(),
                React.createElement(_TimetableEvents.TimetableEvents, { offset: this.offset(), days: this.days() }),
                this.renderMarker(),
                React.createElement(_FocusedCourse.FocusedCourse, null)
            );
        }
    }]);

    return Timetable;
}(React.Component)) || _class) || _class);