'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TimetableEvents = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactRedux = require('react-redux');

var _dateFns = require('date-fns');

var _CourseWrapper = require('./CourseWrapper');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function setIntersection(a, b) {
    return a.some(function (ae) {
        return b.indexOf(ae) > -1;
    }) || b.some(function (be) {
        return a.indexOf(be) > -1;
    });
}

function isLargerSet(a, b) {
    return a.length > b.length;
}

function collectGroups(events) {
    return events.reduce(function (conflicts, event, i, all) {
        var inConflict = all.reduce(function (ids, e) {
            var conflict = e.id !== event.id && (0, _dateFns.compareAsc)(event.start, e.end) * (0, _dateFns.compareAsc)(event.end, e.start) < 0;
            return conflict ? ids.concat([e.id]) : ids;
        }, []);
        if (inConflict.length > 0) {
            inConflict.push(event.id);
            conflicts = conflicts.length === 0 ? [inConflict] : conflicts.reduce(function (newConflicts, olderConflict) {
                return setIntersection(olderConflict, inConflict) && isLargerSet(inConflict, olderConflict) ? newConflicts : newConflicts.concat([olderConflict]);
            }, []);
            return conflicts.some(function (olderConflict) {
                return setIntersection(olderConflict, inConflict);
            }) ? conflicts : conflicts.concat([inConflict]);
        } else {
            return conflicts.concat([[event.id]]);
        }
    }, []);
}

function mapEvents(events, offset) {
    var groups = collectGroups(events);
    var indexed = events.reduce(function (dict, event) {
        return _extends({}, dict, _defineProperty({}, event.id, event));
    }, {});
    return groups.map(function (group) {
        var eventGroup = group.map(function (id) {
            return indexed[id];
        });
        return React.createElement(_CourseWrapper.CourseWrapper, { key: '' + group.reduce(function (s, id) {
                return s + id;
            }, offset), events: eventGroup,
            offset: offset });
    });
}

function isVisible(offset, days) {
    return function (event) {
        return event.start >= offset && event.start < (0, _dateFns.addDays)(offset, days);
    };
}

var TimetableEvents = exports.TimetableEvents = (_dec = (0, _reactRedux.connect)(function (state, _ref) {
    var offset = _ref.offset,
        days = _ref.days;
    return {
        events: state.app.events.filter(isVisible(offset, days))
    };
}), _dec(_class = function (_React$Component) {
    _inherits(TimetableEvents, _React$Component);

    function TimetableEvents() {
        _classCallCheck(this, TimetableEvents);

        return _possibleConstructorReturn(this, (TimetableEvents.__proto__ || Object.getPrototypeOf(TimetableEvents)).apply(this, arguments));
    }

    _createClass(TimetableEvents, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                events = _props.events,
                offset = _props.offset;

            return mapEvents(events, offset);
        }
    }]);

    return TimetableEvents;
}(React.Component)) || _class);