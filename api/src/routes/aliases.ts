import {Router} from "express";
import {getAlias, setAliasNoPass} from "../alias";
import {NewMeta} from "../types";
import {getCalendarFromMeta} from "../calendar";
import {createHash} from 'crypto';
import * as stringify from 'json-stable-stringify';

export default function(router: Router): Router {

    router.get('/:id', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            const {value} = await getAlias(req.params.id);
            const meta: NewMeta[] = JSON.parse(value);
            const calendar = await getCalendarFromMeta(meta);
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
            const json: string = (stringify as any)((req.body as NewMeta[])
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