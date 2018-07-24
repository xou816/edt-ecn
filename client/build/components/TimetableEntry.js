'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimetableEntry = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _core = require('@material-ui/core');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var INCREMENT = 1000 * 60 * 15;
var DAY_MS = 1000 * 60 * 60 * 24;

var TimetableEntry = exports.TimetableEntry = (_dec = (0, _core.withStyles)(function (theme) {
    return {
        root: {
            display: 'flex',
            height: '100%',
            background: 'none',
            flex: 1,
            position: 'relative'
        }
    };
}), _dec(_class = function (_React$Component) {
    _inherits(TimetableEntry, _React$Component);

    function TimetableEntry() {
        _classCallCheck(this, TimetableEntry);

        return _possibleConstructorReturn(this, (TimetableEntry.__proto__ || Object.getPrototypeOf(TimetableEntry)).apply(this, arguments));
    }

    _createClass(TimetableEntry, [{
        key: 'start',
        value: function start() {
            var event = this.props.event;
            return Math.floor((event.start.valueOf() - this.props.offset) % DAY_MS / INCREMENT) + 1;
        }
    }, {
        key: 'span',
        value: function span() {
            var event = this.props.event;
            return Math.floor((event.end.valueOf() - event.start.valueOf()) / INCREMENT);
        }
    }, {
        key: 'day',
        value: function day() {
            var event = this.props.event;
            return Math.floor((event.start.valueOf() - this.props.offset) / DAY_MS) + 1;
        }
    }, {
        key: 'gridRow',
        value: function gridRow() {
            var start = this.start();
            var span = this.span();
            return { gridRow: start + 1 + ' / span ' + span };
        }
    }, {
        key: 'gridColumn',
        value: function gridColumn() {
            var day = this.day();
            return { gridColumn: day.toString() };
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                classes = _props.classes,
                onClick = _props.onClick,
                children = _props.children;

            return React.createElement(
                _core.Zoom,
                { 'in': true },
                React.createElement(
                    'div',
                    { onClick: onClick, style: _extends({}, this.gridRow(), this.gridColumn()), className: classes.root },
                    children
                )
            );
        }
    }]);

    return TimetableEntry;
}(React.Component)) || _class);