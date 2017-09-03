const calendar = require('../src/calendar');
const alias = require('../src/alias');
const checkCredentials = require('../src/ldap');

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
		res.render('index');
	});

	router.get('/custom', function(req, res) {
		calendar.listOnlineCalendars()
			.then(list => {
				res.render('calendars', { calendars: indexByLetter(list, 'name') });
			})
			.catch(err => {
				console.error(err);
				res.status(500);
			});
	});

	router.post('/custom', function(req, res) {
		req.session.calendars = Object.keys(req.body);
		res.redirect('/custom/subjects');
	})

	router.get('/custom/subjects', function(req, res) {
		let ids = req.session.calendars || [];
		let namesPromise = calendar.listOnlineCalendars()
			.then(arr => arr
				.filter(cal => ids.indexOf(cal.id) > -1)
				.map(cal => cal.name));
		let subjectsPromises = ids
			.map(id => calendar.getOnlineCalendar(id).then(calendar.getSubjects));
		Promise.all(subjectsPromises.concat(namesPromise))
			.then(payload => {
				let names = payload.pop();
				let subjects = payload;
				req.session.checksums = subjects.map((s) => calendar.createFilterChecksum(s));
				res.render('edit', {
					subjects: subjects,
					names: names,
					ids: ids,
				});
			})
			.catch(err => {
				console.error(err);
				res.status(500);
			});
	});

	router.post('/custom/subjects', function(req, res) {
		let ids = req.session.calendars || [];
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
		let filter;
		if (Object.keys(mapping).length > 0) {
			filter = Object.keys(mapping)
				.map((cal, i) => calendar.createFilter(ids[cal], mapping[cal]) + '_' + req.session.checksums[i]);
		} else {
			filter = ids;
		}
		req.session.filter = filter.join('+')
		res.redirect('/custom/result');
	});

	router.get('/custom/result', function(req, res) {
		if (req.query.save && req.session.username) {
			alias.setAliasNoPass(req.session.username, req.session.filter)
				.then(_ => {
					res.render('result', {
						base: req.protocol + '://' + req.get('host'),
						path: 'alias/' + req.session.username,
						show_alias: false,
						connected: true
					});
				});
		} else {
			res.render('result', {
				base: req.protocol + '://' + req.get('host'),
				path: 'custom/' + req.session.filter,
				show_alias: true,
				connected: req.session.username != null
			});
		}
	});

	router.get('/login', function(req, res) {
		if (req.session.username) {
			res.redirect(req.query.next || '/');
		} else {
			res.render('login', {
				error: false
			});
		}
	});

	router.post('/login', function(req, res) {
		checkCredentials(req.body.username, req.body.password)
			.then(_ => {
				req.session.username = req.body.username;
				res.redirect(req.query.next || '/');
			})
			.catch(_ => res.render('login', { error: true }));
	});

	return router;

}