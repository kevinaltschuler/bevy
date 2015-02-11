/**
 * app.js
 * entry point for the entire app
 */

'use strict';

// load config + utilities
var config = require('./config');
var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');

// load express modules and middleware
var subdomain = require('express-subdomain');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var passport = require('passport');

// custom middleware
var middleware = require('./middleware');

// load express
var app = express();

// connect to db
require('./db');


// load api routes onto api.bevy subdomain
// TODO: user auth
// TODO: multi level api (v1, v2, etc)
var api_router = express.Router();
require('./routes/api')(api_router);
app.use(subdomain('api', api_router));

// load routes
var routes = require('./routes')(app);

// middleware
app.use(favicon('./public/img/favicon.ico'));

// pretty print json by default
// disable in production?
app.set('json spaces', 2);

var access_log_stream = fs.createWriteStream(__dirname + '/log/access.log', {flags: 'a'});
app.use(logger('dev', {stream: access_log_stream}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(methodOverride());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	  secret: 'keyboard cat'
	, cookie: {
		  secret: true
		, expires: false
	}
	, resave: true
	, saveUninitialized: true
}));

var User = mongoose.model('User');
config.passport(app, User);
app.use(passport.initialize());
app.use(passport.session());


app.use(csrf());
app.use(function(req, res, next) {
	res.locals.csrf = req.csrfToken();
	return next();
});

// cors
app.use(middleware.cors());

// templating engine for pages outside of the SPA
app.set('view engine', 'jade');
app.set('views', './views');

// static directories
app.use(express.static(__dirname + '/public'));

// error handling
var error = require('./error');
app.use(error.log_errors);
app.use(error.client_error_handler);
app.use(error.error_handler);


// start server
var server = app.listen(config.app.server.port, function() {
	var name = config.app.name;
	var host = server.address().address;
	var port = server.address().port;
	var env = config.app.env;
	console.log('%s listening at http://%s:%s in %O mode', name, host, port, env);
});
