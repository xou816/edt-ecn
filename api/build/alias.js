"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = require("redis");
var url_1 = require("url");
var crypto_1 = require("crypto");
function createRedisClient() {
    if (process.env.REDISTOGO_URL != null) {
        var rtg = url_1.parse(process.env.REDISTOGO_URL);
        if (rtg.port != null && rtg.hostname != null && rtg.auth != null) {
            var redis_2 = redis_1.createClient(parseInt(rtg.port, 10), rtg.hostname, {});
            redis_2.auth(rtg.auth.split(':')[1]);
            return redis_2;
        }
    }
    return redis_1.createClient();
}
var redis = createRedisClient();
var hashPin = function (alias, pin) { return crypto_1.createHash('sha1').update(alias + pin).digest('hex'); };
function getAlias(alias) {
    return new Promise(function (resolve, reject) {
        redis.hgetall(alias, function (err, res) {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}
function aliasExists(alias) {
    return new Promise(function (resolve, reject) {
        redis.exists(alias, function (err, res) {
            if (err)
                reject(err);
            resolve(res > 0);
        });
    });
}
exports.aliasExists = aliasExists;
function getCalId(alias) {
    return new Promise(function (resolve, reject) {
        redis.hget(alias, 'value', function (err, res) {
            if (err || res === null)
                reject(err);
            resolve(res);
        });
    });
}
exports.getCalId = getCalId;
function setAlias(alias, pin, value) {
    var hash = hashPin(alias, pin);
    var setAliasPromise = new Promise(function (resolve, reject) {
        redis.hmset(alias, { hash: hash, value: value }, function (err, res) {
            if (err)
                reject(err);
            resolve(res);
        });
    });
    return getAlias(alias)
        .then(function (doc) { return doc !== null && hash === doc.hash || doc === null ?
        Promise.resolve() : Promise.reject('Hash mismatch'); })
        .then(function (_) { return setAliasPromise; });
}
exports.setAlias = setAlias;
function setAliasNoPass(alias, value) {
    return new Promise(function (resolve, reject) {
        redis.hmset(alias, { value: value }, function (err, res) {
            if (err)
                reject(err);
            return resolve(res);
        });
    });
}
exports.setAliasNoPass = setAliasNoPass;
;
