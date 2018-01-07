const calendar = require('../src/calendar');
const alias = require('../src/alias');
const path = require('path');
const moment = require('moment-timezone');

module.exports = function(router) {

	router.get('/', function(req, res) {
		let paths = [
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
		].map(route => path.join(req.protocol + '://' + req.get('host') + req.originalUrl,  route));
		res.setHeader('Content-Type', 'application/json');
		res.status(200);
		res.send(JSON.stringify(paths));
	});

	router.get('/calendar/list', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.listOnlineCalendars()
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/:name.ics', function(req, res) {
		res.setHeader('Content-Type', 'text/calendar');
		calendar.getIdFromName(req.params.name)
			.then(calendar.getOnlineCalendar)
			.then(calendar.calendarToIcs)
			.then((ics) => res.send(ics))
			.catch((error) => {
				res.status(404);
				res.send('404 Not found');
			});
	});

	router.get('/calendar/:name', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.getIdFromName(req.params.name)
			.then(calendar.getOnlineCalendar)
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(404);
				res.send({ error: '404 Not found' });
			});
	});

	router.get('/calendar/custom/:id.ics', function(req, res) {
		res.setHeader('Content-Type', 'text/calendar');
		calendar.getCustomCalendar(req.params.id)
			.then(calendar.calendarToIcs)
			.then((ics) => res.send(ics))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/custom/:id', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.getCustomCalendar(req.params.id)
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/:name/subjects', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.getIdFromName(req.params.name)
			.then(calendar.getOnlineCalendar)
			.then(calendar.getSubjects)
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(404);
				res.send({ error: '404 Not found' });
			});
	});

	router.get('/calendar/custom/:id/subjects', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.getCustomCalendar(req.params.id)
			.then(calendar.getSubjects)
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/alias/:alias.ics', function(req, res) {
		res.setHeader('Content-Type', 'text/calendar');
		alias.getCalId(req.params.alias)
			.then(calendar.getCustomCalendar)
			.then(calendar.calendarToIcs)
			.then((ics) => res.send(ics))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/alias/:alias', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		alias.getCalId(req.params.alias)
			.then(calendar.getCustomCalendar)
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/alias/:alias/subjects', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		alias.getCalId(req.params.alias)
			.then(calendar.getCustomCalendar)
			.then(calendar.getSubjects)
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/freeroom/:from/:to', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		let count = parseInt(req.query.count, 10) || 1;
		let from = moment.tz(parseInt(req.params.from, 10), 'Europe/Paris');
		let to = moment.tz(parseInt(req.params.to, 10), 'Europe/Paris');
		let keepRoom = id => calendar.getOnlineCalendar(id)
			.then(events => events
				.filter(e => e.start >= from && e.end <= to))
			.then(events => events.length === 0);
		let matches = calendar.listOnlineCalendars('r')
			.then(cals => cals.reduce((promise, cal) => {
				return promise
					.then(res => res.length >= count ? res : keepRoom(cal.id)
						.then(keep => keep ? res.concat([cal.name]) : res))
			}, Promise.resolve([])));
		matches.then(JSON.stringify)
			.then(json => res.send(json))
			.catch(error => {
				res.status(500);
				res.send({error});
			});
	});

	return router;

}