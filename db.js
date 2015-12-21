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

// attempt connection
mongoose.connect(config.database.URL);
var connection = mongoose.connection;
connection.on('error', console.error.bind(
	  console
	, 'connection error:'
));
connection.once('open', function() {
	console.info('connected to database');
});
