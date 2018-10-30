import * as calendar from '../calendar';
import {tz} from 'moment-timezone';
import {Router} from 'express';
import {CelcatCalendarType} from "../calendars/celcat";
import {getCalId} from "../alias";

export default function apiRouter(router: Router): Router {

    router.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    router.get('/calendar/list', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        calendar.listOnlineCalendars('group')
            .then(JSON.stringify)
            .then((json) => res.send(json))
            .catch((error) => {
                res.status(500);
                res.send({error});
            });
    });

    router.get('/calendar/list/:type', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        calendar.listOnlineCalendars(req.params.type as CelcatCalendarType)
            .then(JSON.stringify)
            .then((json) => res.send(json))
            .catch((error) => {
                res.status(500);
                res.send({error});
            });
    });

    router.post('/calendar/custom', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        calendar.createFilterFromMeta(req.body)
            .then((result: string) => {
                res.send(JSON.stringify({result}))
            })
            .catch(error => {
                res.status(500);
                res.send({error: '500 Internal Server Error'});
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
                console.error(error);
                res.send('500 Internal Server Error');
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

    router.get('/calendar/custom/:id/subjects', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        calendar.getCustomCalendar(req.params.id)
            .then(calendar.getSubjects)
            .then(JSON.stringify)
            .then(json => res.send(json))
            .catch(error => {
                res.status(500);
                res.send({error});
            });
    });

    router.get('/calendar/personal/:id', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        getCalId(req.params.id)
            .then(calendar.getCustomCalendar)
            .then(JSON.stringify)
            .then(json => res.send(json))
            .catch(error => {
                res.status(404);
                res.send({error: 'Alias does not exist'});
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
                .filter(e => e.start && e.end && e.start >= from && e.end <= to))
            .then(events => events.length === 0);
        let matches = calendar.listOnlineCalendars( 'room')
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