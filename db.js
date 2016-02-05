/**
 * db.js
 * attempt to connect to mongodb
 * then, load all models into mongoose
 */

'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('./config');

// load models into mongoose
var models = require('./models');

var Client = require('./models/Client');

// attempt connection
mongoose.connect(config.database.URL);
var connection = mongoose.connection;
connection.on('error', console.error.bind(
	  console
	, 'connection error:'
));
connection.once('open', function() {
	console.log('connected to database');

	Client.remove({}, function(err) {
		var web_client = new Client({
			name: "Web API v1",
			client_id: config.auth.clients.web,
			secret: config.auth.keys.oauth_clients.web
		});
		var ios_client = new Client({
			name: "IOS API v1",
			client_id: config.auth.clients.ios,
			secret: config.auth.keys.oauth_clients.ios
		});
		var android_client = new Client({
			name: "Android API v1",
			client_id: config.auth.clients.android,
			secret: config.auth.keys.oauth_clients.android
		});
		web_client.save();
		ios_client.save();
		android_client.save();
	});
});
