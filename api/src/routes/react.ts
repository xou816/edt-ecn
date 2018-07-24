import {Router} from "express";
import {readFile} from "fs";
import {join} from 'path';

export default function reactRouter(router: Router): Router {

    router.use((req, res) => {
        readFile(join(__dirname, '../public/index.html'), 'utf8', (err, data) => {
            res.send(data);
        });
    });

    return router;
}