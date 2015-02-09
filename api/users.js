//TODO: AUTH
//TODO: CUSTOM EXCEPTIONS
// handleError(err) <--

'use strict';

var _ = require('underscore');
var bcrypt = require('bcryptjs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');

// INDEX
exports.index = function(req, res, next) {

	// for now just returns all

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
	//TODO: check for dupes

	//TODO: verify email

	// collect user data
	var _id = ObjectId();
	var token = req.param('token') || '';
	var display_name = req.param('display_name') || '';
	var email = req.param('email');
	var password = req.param('password');
	if(password) password = bcrypt.hashSync(password, 8);
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
	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	// todo: verify object id

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
		next();
	});
}

// EDIT
exports.edit = function(req, res, next) {
	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	// collect user data
	var token = req.param('token') || '';
	var display_name = req.param('display_name') || '';
	var email = req.param('email') || '';
	var password = req.param('password') || '';
	if(password) password = bcrypt.hashSync(password, 8);
	var updated = new Date();

	var update = {};
	if(token) update.token = token;
	if(display_name) update.display_name = display_name;
	if(email) update.email = email;
	if(password) update.password = password;
	if(update) update.updated = updated;

	// todo: verify object id

	var query = { _id: object_id };
	User.findOneAndUpdate(query, update).exec(function(err, user) {
		if(err) throw err;

		res.json({
			  status: 'GET /user/' + _id + '/edit'
			, object: 'user'
			, user: user
		});
	});
}

// UPDATE
// force update
exports.update = function(req, res, next) {
	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	//collect user data
	var token = req.param('token') || '';
	var display_name = req.param('display_name') || '';
	var email = req.param('email') || '';
	var password = req.param('password') || '';
	if(password) password = bcrypt.hashSync(password, 8);
	var updated = new Date();

	// check for necessary values
	if(_.isEmpty(email)) {
		throw new Error('missing email');
	} else if (_.isEmpty(password)) {
		throw new Error('missing password');
	}

	var update = {
		  token: token
		, display_name: display_name
		, email: email
		, password: password
		, updated: updated
	}

	var query = { _id: object_id };
	User.findOneAndUpdate(query, update).exec(function(err, user) {
		if(err) throw err;

		res.json({
			  status: 'PUT/PATCH /user/' + _id
			, object: 'user'
			, user: user
		});
	});
}

// DESTROY
exports.destroy = function(req, res, next) {
	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	var query = { _id: object_id };
	User.remove(query, function(err) {
		if(err) throw err;
	});
}
