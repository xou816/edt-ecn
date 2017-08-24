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
		res.redirect('/custom');
	});

	router.get('/custom', function(req, res) {
		calendar.listOnlineCalendars()
			.then((list) => {
				res.render('calendars', { calendars: indexByLetter(list, 'name') });
			});
	});

	router.post('/custom', function(req, res) {
		req.session.calendars = Object.keys(req.body);
		res.redirect('/custom/subjects');
	})

	router.get('/custom/subjects', function(req, res) {
		let ids = req.session.calendars || [];
		let p = Promise.all(ids.map(calendar.getOnlineCalendar))
			.then(all => Promise.all(all.map(calendar.getSubjects)));
		p.then(subjects => {
			res.render('edit', {
				subjects: subjects,
				names: ids,
				ids: ids,
			});
		});
	});

	router.post('/custom/subjects', function(req, res) {
		let ids = req.session.calendars || [];
		let raw = Object.keys(req.body);
		let mapping = Object.keys(req.body)
			.map(id => id.split('_'))
			.reduce((acc, pair) => {
				let [cal, index] = pair;
				index = parseInt(index, 10);
				if (typeof acc[cal] === 'undefined') {
					acc[cal] = [index];
				} else {
					acc[cal].push(index);
				}
				return acc;
			}, {});
		let filter = Object.keys(mapping)
			.map(cal => calendar.createFilter(ids[cal], mapping[cal]))
			.join('+');
		res.render('result', {
			path: 'custom/' + filter
		});
	});

	return router;

}