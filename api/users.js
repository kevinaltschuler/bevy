'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User');

exports.index = function(req, res, next) {

	// for now just returns all
	//TODO: AUTH

	var user_map = [];

	User.find().exec(function(err, users) {
		if(err) console.error(err);
		return users;
	}).then(function(users) {
		res.json({
			  status: 'GET /user'
			, object: 'user list'
			, users: users
		});
	});
}
