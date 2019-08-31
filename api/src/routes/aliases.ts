import {Router} from "express";
import {getAlias, setAliasNoPass} from "../alias";
import {Meta} from "../types";
import {calendarToIcs, getCalendarFromMeta} from "../calendar";
import {createHash} from 'crypto';
import * as stringify from 'json-stable-stringify';

async function getCalendar(alias: string) {
    const {value} = await getAlias(alias);
    const meta: Meta[] = JSON.parse(value);
    return getCalendarFromMeta(meta);
}

export default function(router: Router): Router {

    router.get('/:id.ics', async (req, res) => {
        res.setHeader('Content-Type', 'text/calendar');
        try {
            const calendar = await getCalendar(req.params.id);
            res.send(calendarToIcs(calendar.events));
        } catch (e) {
            res.status(404);
            res.send('Calendar not found');
        }
    });

    router.get('/:id', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            const calendar = await getCalendar(req.params.id);
            res.send({
                ...calendar,
                id: req.params.id
            });
        } catch (e) {
            res.status(404);
            res.send({error: 'Calendar not found'});
        }
    });

    router.post('/', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            const json: string = (stringify as any)((req.body as Meta[])
                .sort((a, b) => a.id < b.id ? -1 : 1));
            const id = createHash('sha1').update(json).digest('hex').substring(0, 10);
            const saved = await setAliasNoPass(id, json);
            res.send({
                result: id,
                saved
            });
        } catch (e) {
            res.status(500);
            res.send({error: 'Internal Server Error'});
        }
    });

    return router;
}