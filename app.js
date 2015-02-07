'use strict';

// load config + utilities
var config = require('./config');
var _ = require('underscore');

// load express
var express = require('express');
var app = express();

// load express modules


// load apis
var api = require('./api')(app);

// load routes
var routes = require('./routes')(app);

var server = app.listen(config.app.server.port, function() {
	var name = config.app.name;
	var host = server.address().address;
	var port = server.address().port;
	var env = config.app.env;
	console.log('%s listening at http://%s:%s in %O mode', name, host, port, env);
})
