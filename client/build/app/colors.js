'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var COLORS = exports.COLORS = {
    color1: '#345995',
    color2: '#D81159',
    color3: '#FFBC42',
    color4: '#0496FF',
    color5: '#FF9F1C',
    color6: '#68A357',
    color7: '#C45BAA',
    color8: '#C17C74',
    color9: '#7A6563',
    color0: '#662E9B'
};

var COLOR_CLASSES = exports.COLOR_CLASSES = Object.keys(COLORS).reduce(function (classes, key) {
    return _extends({}, classes, _defineProperty({}, key, {
        backgroundColor: COLORS[key] + ' !important',
        color: 'white !important'
    }));
}, {});