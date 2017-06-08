var calendar = require('./calendar.js');
var express = require('express');
var app = express();

app.set('view engine', 'pug');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const batch = function(arr, len) {
	return arr.reduce((acc, val) => {
		var l = acc[acc.length-1].length;
		if (l < len) {
			acc[acc.length-1].push(val);
		} else {
			acc.push([val]);
		}
		return acc;
	}, [[]]);
};

app.get('/calendar/list', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	calendar.listOnlineCalendars()
		.then((list) => res.send(JSON.stringify(list)));
});

app.get('/calendar/:name.ics', function(req, res) {
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

app.get('/calendar/:name', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	calendar.getIdFromName(req.params.name)
		.then((id) => calendar.getOnlineCalendar(id))
		.then((courses) => res.send(JSON.stringify(courses)))
		.catch((err) => {
			res.status(404);
			res.send({ error: '404 Not found' });
		});
});

app.get('/calendar/custom/:id.ics', function(req, res) {
	res.setHeader('Content-Type', 'text/calendar');
	calendar.getCustomCalendar(req.params.id)
		.then((cal) => calendar.calendarToIcs(cal))
		.then((cal) => res.send(cal));
});

app.get('/calendar/custom/:id', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	calendar.getCustomCalendar(req.params.id)
		.then((cal) => res.send(JSON.stringify(cal)));
});

app.get('/calendar/:name/subjects', function(req, res) {
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

app.get('/calendar/:name/customize', function(req, res) {
	var _id;
	calendar.getIdFromName(req.params.name)
		.then((id) => {
			_id = id;
			return calendar.getOnlineCalendar(id)
		})
		.then((cal) => calendar.getSubjects(cal))
		.then((subjects) => res.render('edit', {
			subjects: batch(subjects, 15),
			batch_size: 15,
			col_size: Math.floor(12/Math.ceil(subjects.length/15)),
			id: _id,
			count: subjects.length,
			name: req.params.name
		}));
});

app.post('/calendar/:name/customize', function(req, res) {
	var indices = [];
	for (var i = 0; i < req.body.count; i++) {
		if (req.body['subject_' + i.toString()]) {
			indices.push(i);
		}
	}
	var filter = calendar.createFilter(indices, req.body.count);
	res.render('result', {
		id: req.body.id + '-' + filter,
		name: req.params.name
	});
});

app.get('/', function(req, res) {
	calendar.listOnlineCalendars()
		.then((list) => {
			res.render('index', { calendars: list });
		});
});

var port = typeof process.env.PORT !== 'undefined' ? process.env.PORT : 3000;
app.listen(port, () => console.log(port));