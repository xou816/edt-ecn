import {join} from 'path';
import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import apiRouter from './routes/api';
import mainRouter from './routes/main';

let app = express();
app.set('view engine', 'pug');
app.set('views', join(__dirname, '/../views'));
app.use('/public', express.static('views/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: process.env.SECRET != null ? process.env.SECRET! : 'tacocat',
}));


app.use('/', mainRouter(express.Router()));
app.use('/api', apiRouter(express.Router()));

let port = process.env.PORT != null ? process.env.PORT : 3000;
app.listen(port, () => console.log(port));