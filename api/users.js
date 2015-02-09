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
		if(err) throw err;

		return users;
	}).then(function(users) {
		res.json({
			  status: 'GET /user'
			, object: 'user array'
			, users: users
		});
	});
}

//CREATE
exports.create = function(req, res, next) {
	//TODO: AUTH

	//TODO: check for dupes

	//TODO: verify email

	// collect user data
	var _id = mongoose.Types.ObjectId();
	var display_name = req.param('display_name') || '';
	var email = req.param('email');
	var password = req.param('password');
	var created = new Date();
	var updated = new Date();

	// check for necessary values
	if(_.isEmpty(email)) {
		throw new Error('missing email');
	} else if (_.isEmpty(password)) {
		throw new Error('missing password');
	}

	var user_doc = {
		  _id: _id
		, token: ''
		, display_name: display_name
		, email: email
		, password: password
		, created: created
		, updated: updated
	}

	User.create(user_doc, function(err, user) {
		if(err) throw err

		user_doc.object = 'user';
		res.json(user_doc);
	});

}
