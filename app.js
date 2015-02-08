/**
 * app.js
 * entry point for the entire app
 */

'use strict';

// load config + utilities
var config = require('./config');
var _ = require('underscore');
var path = require('path');
var express = require('express');

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

// load express
var app = express();

// connect to db
require('./db');


// static directories
app.use(express.static(__dirname + '/public'));

// load api routes onto api.bevy subdomain
// TODO: user auth
// TODO: multi level api (v1, v2, etc)
var api_router = express.Router();
require('./routes/api')(api_router);
app.use(subdomain('api', api_router));

// load routes
var routes = require('./routes')(app);

// middleware
//app.use(favicon); //TODO: favicon(path.join(__dirname, 'public', 'favicon.ico'));
app.use(logger('dev'));
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
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use(function(req, res, next) {
	res.locals.csrf = req.csrfToken();
	return next();
});

// error handling
// TODO: separate file?
app.use(log_errors);
app.use(client_error_handler);
app.use(error_handler);

function log_errors(err, req, res, next) {
	console.error('log_errors', err.toString());
	next(err);
}
function client_error_handler(err, req, res, next) {
	console.error('client_errors', err.toString());
	res.send(500, {
		error: err.toString()
	});
	if(req.xhr) {
		console.error(err);
		res.send(500, {
			error: err.toString()
		});
	} else {
		next(err);
	}
}
function error_handler(err, req, res, next) {
	console.error('last_errors ', err.toString());
	res.send(500, {
		error: err.toString()
	});
}

// start server
var server = app.listen(config.app.server.port, function() {
	var name = config.app.name;
	var host = server.address().address;
	var port = server.address().port;
	var env = config.app.env;
	console.log('%s listening at http://%s:%s in %O mode', name, host, port, env);
});
