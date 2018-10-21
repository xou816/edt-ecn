import * as express from 'express';
import * as session from 'express-session';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import apiRouter from './routes/api';

let app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET != null ? process.env.SECRET! : 'tacocat',
}));

app.use('/api', apiRouter(express.Router()));

let port = parseInt(process.env.PORT || '3000', 10) + 1;
app.listen(port);