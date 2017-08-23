const calendar = require('../calendar');

let fancy = function(formattings, name) {
	let fancy_name = '';
	formattings.some(o => {
		let res = o.reg.exec(name);
		if (res) {
			fancy_name = o.formatter.call(null, res[1]);
			return true;
		} else {
			return false;
		}
	});
	return fancy_name;
};

let mappings = [
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

module.exports = function(router) {

	router.get('/calendar/:name/customize', function(req, res) {
		let _id;
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

	router.post('/calendar/:name/customize', function(req, res) {
		let indices = [];
		for (let i = 0; i < req.body.count; i++) {
			if (req.body['subject_' + i.toString()]) {
				indices.push(i);
			}
		}
		let filter = calendar.createFilter(req.body.id, indices, req.body.count);
		res.render('result', {
			id: filter,
			name: req.params.name.toUpperCase()
		});
	});

	router.get('/', function(req, res) {
		calendar.listOnlineCalendars()
			.then((list) => {
				res.render('index', { calendars: list });
			});
	});

	return router;

}