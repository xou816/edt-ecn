'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.NestedList = NestedList;

var _core = require('@material-ui/core');

var _ExpandLess = require('@material-ui/icons/ExpandLess');

var _ExpandLess2 = _interopRequireDefault(_ExpandLess);

var _ExpandMore = require('@material-ui/icons/ExpandMore');

var _ExpandMore2 = _interopRequireDefault(_ExpandMore);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NestedList(props) {
    return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
            _core.ListItem,
            { onClick: props.unfold, button: true },
            _react2.default.createElement(_core.ListItemText, { primary: props.title }),
            props.shown ? _react2.default.createElement(_ExpandLess2.default, null) : _react2.default.createElement(_ExpandMore2.default, null)
        ),
        _react2.default.createElement(
            _core.Collapse,
            { 'in': props.shown },
            _react2.default.createElement(
                _core.List,
                null,
                props.nested.map(function (element) {
                    return _react2.default.createElement(
                        _core.ListItem,
                        { key: props.getId(element), onClick: function onClick() {
                                return props.toggle(props.getId(element));
                            }, button: true },
                        _react2.default.createElement(_core.Checkbox, _extends({}, props.checkbox, { checked: props.checked(props.getId(element)), tabIndex: -1, disableRipple: true })),
                        _react2.default.createElement(_core.ListItemText, { primary: props.getDisplay(element) })
                    );
                })
            )
        )
    );
}