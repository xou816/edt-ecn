const calendar = require('../calendar');

const indexByLetter = function(list, key) {
	if (list.length) {
		let first_letter = list[0][key][0];
		let init = { current: first_letter };
		init[first_letter] = [];
		let final = list.reduce((acc, curr) => {
			let first = curr[key][0];
			if (first !== acc.current) {
				acc.current = first;
				acc[first] = [];
			}
			acc[acc.current].push(curr);
			return acc;
		}, init);
		delete final.current;
		return final;
	} else {
		return {};
	}
};

module.exports = function(router) {

	router.get('/', function(req, res) {
		calendar.listOnlineCalendars()
			.then((list) => {
				res.render('index', { calendars: indexByLetter(list, 'name') });
			});
	});

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

	return router;

}