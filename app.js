'use strict';

// load config + utilities
var config = require('./config');
var _ = require('underscore');

// load express modules
var subdomain = require('express-subdomain');

// load express
var express = require('express');
var app = express();


// load apis onto api.bevy subdomain
// TODO: user auth
// TODO: multi level api (v1, v2, etc)
var api_router = express.Router();
var api = require('./api')(api_router);
app.use(subdomain('api', api_router));

// load routes
var routes = require('./routes')(app);


var server = app.listen(config.app.server.port, function() {
	var name = config.app.name;
	var host = server.address().address;
	var port = server.address().port;
	var env = config.app.env;
	console.log('%s listening at http://%s:%s in %O mode', name, host, port, env);
})
