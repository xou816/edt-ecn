"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var session = require("express-session");
var compression = require("compression");
var bodyParser = require("body-parser");
var api_1 = require("./routes/api");
var app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET != null ? process.env.SECRET : 'tacocat',
}));
app.use('/api', api_1.default(express.Router()));
// app.get('/beta', (req, res) => res.redirect('/'));
// app.use('/', reactRouter(express.Router()));
var port = process.env.PORT != null ? process.env.PORT + 1 : 3001;
app.listen(port);
