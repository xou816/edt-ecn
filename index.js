var calendar = require('./calendar.js');
var express = require('express');
var app = express();

app.set('view engine', 'pug');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('views/public'));

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
			subjects: subjects,
			id: _id,
			count: Object.keys(subjects).length,
			name: req.params.name.toUpperCase()
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
		name: req.params.name.toUpperCase()
	});
});

var fancy = function(formattings, name) {
	var fancy_name = '';
	formattings.some(o => {
		var res = o.reg.exec(name);
		if (res) {
			fancy_name = o.formatter.call(null, res[1]);
			return true;
		} else {
			return false;
		}
	});
	return fancy_name;
};

var mappings = [
	{
		reg: /EI1_(\w)/i,
		formatter: a => 'Première année, groupe '+a
	},
	{
		reg: /OD_(\w+)/i,
		formatter: a => 'Option disciplinaire '+a
	},
	{
		reg: /EIA_(\w)/i,
		formatter: a => 'Apprentis EI'+a
	}
];

app.get('/', function(req, res) {
	calendar.listOnlineCalendars()
		.then((list) => list.map((cal) => {
			cal.fancy_name = fancy(mappings, cal.name);
			return cal;
		}))
		.then((list) => {
			res.render('index', { calendars: list });
		});
});

var port = typeof process.env.PORT !== 'undefined' ? process.env.PORT : 3000;
app.listen(port, () => console.log(port));