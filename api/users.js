'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User');

exports.index = function(req, res, next) {

	// for now just returns all
	//TODO: AUTH

	var user_map = {};

	User.find({}, function(err, users) {
		users.forEach(function(user) {
			user_map[user._id] = user;
		});
	});

	res.json({
		  status: 'GET /user'
		, object: 'user list'
		, users: user_map
	});
}
