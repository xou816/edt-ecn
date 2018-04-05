import * as calendar from '../calendar';
import * as alias from '../alias';
import {join} from 'path';
import {tz} from 'moment-timezone';
import {Router} from 'express';
import {Meta} from "../calendar";

export default function apiRouter(router: Router): Router {

	router.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
  		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  		next();
	});

	router.get('/', (req, res) => {
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
		].map(route => join(req.protocol + '://' + req.get('host') + req.originalUrl,  route));
		res.setHeader('Content-Type', 'application/json');
		res.status(200);
		res.send(JSON.stringify(paths));
	});

	router.get('/calendar/list', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		calendar.listOnlineCalendars()
			.then(JSON.stringify)
			.then((json) => res.send(json))
			.catch((error) => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/:name.ics', (req, res) => {
		res.setHeader('Content-Type', 'text/calendar');
		calendar.getIdFromName(req.params.name)
			.then(id => id == null ? Promise.reject('Events not found') : Promise.resolve(id))
			.then(calendar.getOnlineCalendar)
			.then(cal => cal.events)
			.then(calendar.calendarToIcs)
			.then(ics => res.send(ics))
			.catch(error => {
				res.status(404);
				res.send('404 Not found');
			});
	});

	router.get('/calendar/:name', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		calendar.getIdFromName(req.params.name)
			.then(id => id == null ? Promise.reject('Events not found') : Promise.resolve(id))
			.then(calendar.getOnlineCalendar)
			.then(JSON.stringify)
			.then(json => res.send(json))
			.catch(error => {
				res.status(404);
				res.send({ error: '404 Not found' });
			});
	});

	router.post('/calendar/custom', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        req.body.reduce((p: Promise<string[]>, meta: Meta) => p.then(filters =>
                calendar.getOnlineCalendar(meta.id)
                    .then(cal => meta.filter != null && meta.filter.length > 0 ?
                        calendar.createFilter(meta.id, meta.filter, calendar.getSubjects(cal.events)) :
                        meta.id)
                    .then((f: string) => filters.concat([f]))),
            Promise.resolve([]))
            .then((filters: string[]) => filters.join('+'))
            .then((result: string) => {
                res.send(JSON.stringify({result}))
            })
            .catch(error => {
                res.status(500);
                res.send({ error: '505 Internal Server Error' });
            });
	});

	router.get('/calendar/custom/:id.ics', (req, res) => {
		res.setHeader('Content-Type', 'text/calendar');
		calendar.getCustomCalendar(req.params.id)
			.then(cal => cal.events)
			.then(calendar.calendarToIcs)
			.then(ics => res.send(ics))
			.catch(error => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/custom/:id', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		calendar.getCustomCalendar(req.params.id)
			.then(JSON.stringify)
			.then(json => res.send(json))
			.catch(error => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/:name/subjects', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		calendar.getIdFromName(req.params.name)
			.then(id => id == null ? Promise.reject('Events not found') : Promise.resolve(id))
			.then(calendar.getOnlineCalendar)
			.then(cal => cal.events)
			.then(calendar.getSubjects)
			.then(JSON.stringify)
			.then(json => res.send(json))
			.catch(error => {
				res.status(404);
				res.send({ error: '404 Not found' });
			});
	});

	router.get('/calendar/custom/:id/subjects', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		calendar.getCustomCalendar(req.params.id)
            .then(cal => cal.events)
			.then(calendar.getSubjects)
			.then(JSON.stringify)
			.then(json => res.send(json))
			.catch(error => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/alias/:alias.ics', (req, res) => {
		res.setHeader('Content-Type', 'text/calendar');
		alias.getCalId(req.params.alias)
			.then(calendar.getCustomCalendar)
            .then(cal => cal.events)
			.then(calendar.calendarToIcs)
			.then(ics => res.send(ics))
			.catch(error => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/alias/:alias', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		alias.getCalId(req.params.alias)
			.then(calendar.getCustomCalendar)
			.then(JSON.stringify)
			.then(json => res.send(json))
			.catch(error => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/calendar/alias/:alias/subjects', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		alias.getCalId(req.params.alias)
			.then(calendar.getCustomCalendar)
            .then(cal => cal.events)
			.then(calendar.getSubjects)
			.then(JSON.stringify)
			.then(json => res.send(json))
			.catch(error => {
				res.status(500);
				res.send({error});
			});
	});

	router.get('/freeroom/:from/:to', (req, res) => {
		res.setHeader('Content-Type', 'application/json');
		let count = parseInt(req.query.count, 10) || 1;
		let from = tz(parseInt(req.params.from, 10), 'Europe/Paris');
		let to = tz(parseInt(req.params.to, 10), 'Europe/Paris');
		let keepRoom = (id: string) => calendar.getOnlineCalendar(id)
			.then(cal => cal.events)
			.then(events => events
				.filter(e => e.start >= from && e.end <= to))
			.then(events => events.length === 0);
		let matches = calendar.listOnlineCalendars('r')
			.then(cals => cals.reduce((promise: Promise<string[]>, cal) => {
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