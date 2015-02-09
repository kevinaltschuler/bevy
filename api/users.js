//TODO: AUTH
//TODO: CUSTOM EXCEPTIONS

'use strict';

var _ = require('underscore');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

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
	var _id = ObjectId();
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

		res.json({
			  status: 'GET /user/create'
			, object: 'user'
			, user: user_doc
		});
	});
}

// STORE
// disabled for now
exports.store = function() {

}

// SHOW
exports.show = function(req, res, next) {

	// TODO: AUTH

	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	User.findOne({
		_id: object_id
	}).exec(function(err, user) {
		if(err) throw err;

		return user
	}).then(function(user) {

		if(!user) {
			res.json({
				  status: 'GET /user/' + _id
				, object: 'error'
				, message: 'user not found'
			});
			next();
		}

		res.json({
			  status: 'GET /user/' + _id
			, object: 'user'
			, user: user
		});
	});
}
