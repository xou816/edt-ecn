import * as calendar from '../calendar';
import * as alias from '../alias';
import checkCredentials from '../ldap';
import {Router} from 'express';

type Indexable<T> = {[K in keyof T]: string};
type Indexed<T> = {[key: string]: Indexable<T>[]};

function indexByLetter<T>(list: Indexable<T>[], key: keyof Indexable<T>): Indexed<T> {
	if (list.length) {
		let first_letter: string = list[0][key][0];
		let init = { [first_letter]: [] };
		let current: string = first_letter;
		return list.reduce((acc: Indexed<T>, curr: Indexable<T>) => {
			let first = curr[key][0];
			if (first !== current) {
				current = first;
				acc[first] = [];
			}
			acc[current].push(curr);
			return acc;
		}, init);
	} else {
		return {};
	}
};

export default function mainRouter(router: Router): Router {

	router.get('/', (req, res) => {
		res.render('index');
	});

	router.get('/custom', (req, res) => {
		calendar.listOnlineCalendars()
			.then(list => {
				res.render('calendars', { calendars: indexByLetter<calendar.CalendarId>(list, 'name') });
			})
			.catch(err => {
				console.error(err);
				res.status(500);
			});
	});

	router.post('/custom', (req, res) => {
		req.session!.calendars = Object.keys(req.body);
		res.redirect('/custom/subjects');
	})

	router.get('/custom/subjects', (req, res) => {
		let ids: string[] = req.session!.calendars || [];
		let namesPromise: Promise<string[]> = calendar.listOnlineCalendars()
			.then(arr => arr
				.filter(cal => ids.indexOf(cal.id) > -1)
				.map(cal => cal.name));
		let subjectsPromises: Promise<calendar.Subjects>[] = ids
			.map(id => calendar.getOnlineCalendar(id).then(calendar.getSubjects));
		Promise.all(subjectsPromises)
			.then(subjects => namesPromise.then(names => [names, subjects]))
			.then(([names, subjects]) => {
				req.session!.subjects = subjects;
				res.render('edit', {
					subjects,
					names,
					ids,
				});
			})
			.catch(err => {
				console.error(err);
				res.status(500);
			});
	});

	router.post('/custom/subjects', (req, res) => {
		let ids: string[] = req.session!.calendars || [];
		let mapping: number[][] = Object.keys(req.body)
			.map((id: string) => id.split('_'))
			.reduce((acc: number[][], pair) => {
				let [cal, index] = pair.map(i => parseInt(i, 10));
				if (acc[cal] == null) {
					acc[cal] = [index];
				} else {
					acc[cal].push(index);
				}
				return acc;
			}, []);
		let filters;
		if (Object.keys(mapping).length > 0) {
			filters = mapping
				.map((indices, cal) => calendar.createFilter(ids[cal], indices, req.session!.subjects[cal]));
		} else {
			filters = ids;
		}
		req.session!.filter = filters.join('+')
		res.redirect('/custom/result');
	});

	router.get('/custom/result', (req, res) => {
		if (req.query.save && req.session!.username) {
			alias.setAliasNoPass(req.session!.username, req.session!.filter)
				.then(_ => {
					console.log('[RESULT] alias updated: ', req.session!.username);
					res.render('result', {
						base: req.protocol + '://' + req.get('host'),
						path: 'alias/' + req.session!.username,
						show_alias: false,
						connected: true
					});
				});
		} else {
			console.log('[RESULT] filter created: ', req.session!.filter);
			res.render('result', {
				base: req.protocol + '://' + req.get('host'),
				path: 'custom/' + req.session!.filter,
				show_alias: true,
				connected: req.session!.username != null,
				unexpected: ''+req.session!.filter === 'undefined'
			});
		}
	});

	router.get('/login', (req, res) => {
		if (req.session!.username) {
			res.redirect(req.query.next || '/');
		} else {
			res.render('login', {
				error: false
			});
		}
	});

	router.post('/login', (req, res) => {
		checkCredentials(req.body.username, req.body.password)
			.then(_ => {
				req.session!.username = req.body.username;
				res.redirect(req.query.next || '/');
			})
			.catch(_ => res.render('login', { error: true }));
	});

	return router;

}