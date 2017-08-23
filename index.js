var express = require('express');
var app = express();

app.set('view engine', 'pug');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('views/public'));

const mainRouter = require('./routes/main');
app.use('/', mainRouter(express.Router()));

const apiRouter = require('./routes/api');
app.use('/api', apiRouter(express.Router()));

var port = typeof process.env.PORT !== 'undefined' ? process.env.PORT : 3000;
app.listen(port, () => console.log(port));