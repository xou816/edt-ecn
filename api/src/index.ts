import * as express from 'express';
import * as session from 'express-session';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import apiRouter from './routes/api';
import aliasesRouter from './routes/aliases';

let app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET != null ? process.env.SECRET! : 'tacocat',
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use('/api/calendar/', apiRouter(express.Router()));
app.use('/api/alias/', aliasesRouter(express.Router()));

let port = parseInt(process.env.PORT || '3000', 10) + 1;
app.listen(port);