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
//var connection = mongoose.createConnection(config.database.URL);
mongoose.connect(config.database.URL);
var connection = mongoose.connection;
connection.on('error', console.error.bind(
	  console
	, 'connection error:'
));
connection.once('open', function() {
	console.info('connected to database');

	// seed some stuff if not already
	var User = mongoose.model('User');

	User.find(function(err, users){
		if(err) return console.error(err);

		if(users.length == 0) {
			console.log('seeding users...');

			User.create({
				  _id: mongoose.Types.ObjectId()
				, token: ''
				, display_name: 'foobar'
				, password: bcrypt.hashSync('foobar', 8)
				, email: 'foobar@example.com'
				, created: new Date()
				, updated: new Date()
			});
		} else {
			console.log(users);
		}
	});
});


