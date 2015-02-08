'use strict';

// load config + utilities
var config = require('./config');
var _ = require('underscore');
var express = require('express');
var mongoose = require('mongoose');

// load express modules and middleware
var subdomain = require('express-subdomain');

// load express
var app = express();

// connect to db
var connection = mongoose.createConnection(config.database.URL);
connection.on('error', console.error.bind(
	  console
	, 'connection error:'
));
connection.once('open', function() {
	console.info('connected to database');
});

var models = require('./models');

// static directories
app.use(express.static(__dirname + '/public'));

// load apis onto api.bevy subdomain
// TODO: user auth
// TODO: multi level api (v1, v2, etc)
var api_router = express.Router();
var api = require('./api')(api_router);
app.use(subdomain('api', api_router));

// load routes
var routes = require('./routes')(app);

// middleware

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
