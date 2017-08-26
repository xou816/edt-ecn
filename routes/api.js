const calendar = require('../calendar');

module.exports = function(router) {

	router.get('/', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.status(200);
		res.send(JSON.stringify([
			'/api/calendar/list',
			'/api/calendar/:name',
			'/api/calendar/:name.ics',
			'/api/calendar/:name/subjects',
			'/api/calendar/custom/:id',
			'/api/calendar/custom/:id.ics',
			'/api/calendar/custom/:id/subjects'
		]));
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

	return router;

}