"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var calendar = require("../calendar");
var path_1 = require("path");
var moment_timezone_1 = require("moment-timezone");
function apiRouter(router) {
    router.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    router.get('/', function (req, res) {
        var paths = [
            '/calendar/list',
            '/calendar/:name',
            '/calendar/:name.ics',
            '/calendar/:name/subjects',
            '/calendar/custom/:id',
            '/calendar/custom/:id.ics',
            '/calendar/custom/:id/subjects',
            '/calendar/alias/:alias',
            '/calendar/alias/:alias.ics',
            '/calendar/alias/:alias/subjects',
        ].map(function (route) { return path_1.join(req.protocol + '://' + req.get('host') + req.originalUrl, route); });
        res.setHeader('Content-Type', 'application/json');
        res.status(200);
        res.send(JSON.stringify(paths));
    });
    router.get('/calendar/list', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        calendar.listOnlineCalendars()
            .then(JSON.stringify)
            .then(function (json) { return res.send(json); })
            .catch(function (error) {
            res.status(500);
            res.send({ error: error });
        });
    });
    router.get('/calendar/:name.ics', function (req, res) {
        res.setHeader('Content-Type', 'text/calendar');
        calendar.getIdFromName(req.params.name)
            .then(function (id) { return id == null ? Promise.reject('Events not found') : Promise.resolve(id); })
            .then(calendar.getOnlineCalendar)
            .then(function (cal) { return cal.events; })
            .then(calendar.calendarToIcs)
            .then(function (ics) { return res.send(ics); })
            .catch(function (error) {
            res.status(404);
            res.send('404 Not found');
        });
    });
    router.get('/calendar/:name', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        calendar.getIdFromName(req.params.name)
            .then(function (id) { return id == null ? Promise.reject('Events not found') : Promise.resolve(id); })
            .then(calendar.getOnlineCalendar)
            .then(JSON.stringify)
            .then(function (json) { return res.send(json); })
            .catch(function (error) {
            res.status(404);
            res.send({ error: '404 Not found' });
        });
    });
    router.post('/calendar/custom', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        calendar.createFilterFromMeta(req.body)
            .then(function (result) {
            res.send(JSON.stringify({ result: result }));
        })
            .catch(function (error) {
            res.status(500);
            res.send({ error: '505 Internal Server Error' });
        });
    });
    router.get('/calendar/custom/:id.ics', function (req, res) {
        res.setHeader('Content-Type', 'text/calendar');
        calendar.getCustomCalendar(req.params.id)
            .then(function (cal) { return cal.events; })
            .then(calendar.calendarToIcs)
            .then(function (ics) { return res.send(ics); })
            .catch(function (error) {
            res.status(500);
            res.send({ error: error });
        });
    });
    router.get('/calendar/custom/:id', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        calendar.getCustomCalendar(req.params.id)
            .then(JSON.stringify)
            .then(function (json) { return res.send(json); })
            .catch(function (error) {
            res.status(500);
            res.send({ error: error });
        });
    });
    router.get('/calendar/:name/subjects', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        calendar.getIdFromName(req.params.name)
            .then(function (id) { return id == null ? Promise.reject('Events not found') : Promise.resolve(id); })
            .then(calendar.getOnlineCalendar)
            .then(calendar.getSubjects)
            .then(JSON.stringify)
            .then(function (json) { return res.send(json); })
            .catch(function (error) {
            res.status(404);
            res.send({ error: '404 Not found' });
        });
    });
    router.get('/calendar/custom/:id/subjects', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        calendar.getCustomCalendar(req.params.id)
            .then(calendar.getSubjects)
            .then(JSON.stringify)
            .then(function (json) { return res.send(json); })
            .catch(function (error) {
            res.status(500);
            res.send({ error: error });
        });
    });
    router.get('/freeroom/:from/:to', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var count = parseInt(req.query.count, 10) || 1;
        var from = moment_timezone_1.tz(parseInt(req.params.from, 10), 'Europe/Paris');
        var to = moment_timezone_1.tz(parseInt(req.params.to, 10), 'Europe/Paris');
        var keepRoom = function (id) { return calendar.getOnlineCalendar(id)
            .then(function (cal) { return cal.events; })
            .then(function (events) { return events
            .filter(function (e) { return e.start >= from && e.end <= to; }); })
            .then(function (events) { return events.length === 0; }); };
        var matches = calendar.listOnlineCalendars('room')
            .then(function (cals) { return cals.reduce(function (promise, cal) {
            return promise
                .then(function (res) { return res.length >= count ? res : keepRoom(cal.id)
                .then(function (keep) { return keep ? res.concat([cal.name]) : res; }); });
        }, Promise.resolve([])); });
        matches.then(JSON.stringify)
            .then(function (json) { return res.send(json); })
            .catch(function (error) {
            res.status(500);
            res.send({ error: error });
        });
    });
    return router;
}
exports.default = apiRouter;
