'use strict';

var _ = require('underscore');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User');

// INDEX
exports.index = function(req, res, next) {

	// for now just returns all
	//TODO: AUTH

	User.find().exec(function(err, users) {

		if(err) {
			res.json({
				  status: 'GET /user'
				, object: 'error'
				, message: err.msg
			});
		}

		return users;
	}).then(function(users) {
		res.json({
			  status: 'GET /user'
			, object: 'user array'
			, users: users
		});
	});
}

