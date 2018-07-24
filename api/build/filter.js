"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Filter = /** @class */ (function () {
    function Filter(filters) {
        this.filters = filters;
    }
    Filter.parse = function (input) {
        var len = input.length;
        var strLen = Filter.STR_LEN;
        var count = Math.ceil(input.length / strLen);
        var diff = count * strLen - len;
        var filters = Array.from({ length: count }, function (x, i) { return input.slice(Math.max(0, (count - i - 1) * strLen - diff), (count - i) * strLen - diff); })
            .map(function (fragment) { return parseInt(fragment, Filter.TARGET_BASE); });
        return new Filter(filters);
    };
    Filter.from = function (indices) {
        var max = Math.max.apply(null, indices) + 1;
        var filters = new Array(Math.ceil(max / Filter.MAX_BITS));
        filters.fill(0);
        indices.forEach(function (index) {
            var pos = Math.floor(index / Filter.MAX_BITS);
            var inc = 1 << (index % Filter.MAX_BITS);
            filters[pos] += inc;
        });
        return new Filter(filters);
    };
    Filter.prototype.length = function () {
        var l = this.filters.length;
        return (l - 1) * Filter.MAX_BITS + Math.ceil(Math.log2(this.filters[l - 1]));
    };
    Filter.prototype.toString = function () {
        return this.filters
            .slice()
            .reverse()
            .map(function (num, i) { return num.toString(Filter.TARGET_BASE).padStart(i === 0 ? 0 : Filter.STR_LEN, "0"); })
            .join('');
    };
    Filter.prototype.test = function (index) {
        if (index > -1) {
            var filter = this.filters[Math.floor(index / Filter.MAX_BITS)];
            filter = filter == null ? 0 : filter;
            var bin = (1 << (index % Filter.MAX_BITS)) & filter;
            return bin === 0;
        }
        else {
            return false;
        }
    };
    Filter.TARGET_BASE = 32;
    Filter.MAX_BITS = 28;
    Filter.STR_LEN = Math.ceil(Filter.MAX_BITS / Math.log2(Filter.TARGET_BASE));
    return Filter;
}());
exports.Filter = Filter;
