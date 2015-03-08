/**
 * app.js
 * entry point for the entire app
 *
 * @author albert
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
var multer = require('multer');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');
var passport = require('passport');

var serveStatic = require('serve-static');

// custom middleware
var middleware = require('./middleware');

// load express
var app = express();

// connect to db
require('./db');

// pretty print json by default
app.set('json spaces', 2);

// MIDDLEWARE

// cors
app.use(middleware.cors);

app.use(favicon('./public/img/favicon.ico'));

// logger
var access_log_stream = fs.createWriteStream(__dirname + '/log/access.log', {flags: 'a'});
app.use(logger('dev', {stream: access_log_stream}));

// form parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(methodOverride());

// cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// sessions
app.use(session({
	  secret: 'keyboard cat'
	, cookie: {
		  secret: true
		, expires: false
	}
	, resave: true
	, saveUninitialized: true
}));

// passport
config.passport(app);
app.use(passport.initialize());
app.use(passport.session());

// disable csurf until we need it
//app.use(csrf());
//app.use(function(req, res, next) {
//	res.locals.csrf = req.csrfToken();
//	return next();
//});

// templating engine for pages outside of the SPA
app.set('view engine', 'jade');
app.set('views', './views');

// load api routes onto api.bevy subdomain
// TODO: user auth
// TODO: multi level api (v1, v2, etc)
var api_router = express.Router();
api_router.use(middleware.cors);
require('./routes/api')(api_router);
app.use(subdomain('api', api_router));

// static directories
app.use(serveStatic(__dirname + '/public')); // app-specific assets

// load routes
var routes = require('./routes')(app);

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
