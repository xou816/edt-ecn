let express = require('express');
let app = express();

app.set('view engine', 'pug');
app.use('/public', express.static('views/public'));

let bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let session = require('express-session');
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'tacocat',
}));

const mainRouter = require('./routes/main');
app.use('/', mainRouter(express.Router()));

const apiRouter = require('./routes/api');
app.use('/api', apiRouter(express.Router()));

let port = typeof process.env.PORT !== 'undefined' ? process.env.PORT : 3000;
app.listen(port, () => console.log(port));