const calendar = require('../calendar');

module.exports = function(router) {

	router.get('/', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		res.status(200);
		res.send(JSON.stringify([
			'/calendar/list',
			'/calendar/:name.ics',
			'/calendar/:name',
			'/calendar/custom/:id.ics',
			'/calendar/custom/:id',
			'/calendar/:name/subjects'
		]));
	});

	router.get('/calendar/list', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.listOnlineCalendars()
			.then((list) => res.send(JSON.stringify(list)));
	});

	router.get('/calendar/:name.ics', function(req, res) {
		res.setHeader('Content-Type', 'text/calendar');
		calendar.getIdFromName(req.params.name)
			.then((id) => calendar.getOnlineCalendar(id))
			.then((cal) => calendar.calendarToIcs(cal))
			.then((cal) => res.send(cal))
			.catch((err) => {
				res.status(404);
				res.send('404 Not found');
			});
	});

	router.get('/calendar/:name', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.getIdFromName(req.params.name)
			.then((id) => calendar.getOnlineCalendar(id))
			.then((courses) => res.send(JSON.stringify(courses)))
			.catch((err) => {
				res.status(404);
				res.send({ error: '404 Not found' });
			});
	});

	router.get('/calendar/custom/:id.ics', function(req, res) {
		res.setHeader('Content-Type', 'text/calendar');
		calendar.getCustomCalendar(req.params.id)
			.then((cal) => calendar.calendarToIcs(cal))
			.then((cal) => res.send(cal));
	});

	router.get('/calendar/custom/:id', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.getCustomCalendar(req.params.id)
			.then((cal) => res.send(JSON.stringify(cal)));
	});

	router.get('/calendar/:name/subjects', function(req, res) {
		res.setHeader('Content-Type', 'application/json');
		calendar.getIdFromName(req.params.name)
			.then((id) => calendar.getOnlineCalendar(id))
			.then((cal) => calendar.getSubjects(cal))
			.then((subjects) => res.send(JSON.stringify(subjects)))
			.catch((err) => {
				res.status(404);
				res.send({ error: '404 Not found' });
			});
	});

	return router;

}