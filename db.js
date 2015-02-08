/**
 * db.js
 * attempt to connect to mongodb
 * then, load all models into mongoose
 */

'use strict';

var mongoose = require('mongoose');
var config = require('./config');

var connection = mongoose.createConnection(config.database.URL);
connection.on('error', console.error.bind(
	  console
	, 'connection error:'
));
connection.once('open', function() {
	console.info('connected to database');
});

var models = require('./models');
