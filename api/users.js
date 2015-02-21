//TODO: AUTH
//TODO: CUSTOM EXCEPTIONS
//TODO: PAGINATION
// handleError(err) <--

'use strict';

var _ = require('underscore');
var error = require('./../error');
var bcrypt = require('bcryptjs');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');

// INDEX
// GET /users
exports.index = function(req, res, next) {
	User.find()
		.populate('aliases')
		.exec(function(err, users) {
		if(err) throw err;
		return users;
	}).then(function(users) {
		res.json({
			  status: 'GET /user'
			, object: 'user array'
			, users: users
		});
	}, function(err) { next(err); });
}

// CREATE
// GET /users/create
// POST /users
exports.create = function(req, res, next) {
	//TODO: check for dupes
	//TODO: verify email
	var update = {};
	User.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;
		update[pathname] = val;
	});

	// check for required fields
	if(_.isEmpty(update.email))
		throw error.gen('missing identifier - email', req);
	else if(_.isEmpty(update.password))
		throw error.gen('missing verification - password', req);

	// hash password if it exists
	if(update.password) update.password = bcrypt.hashSync(update.password, 8);

	var promise = User.findOne({ email: update.email }).exec();
	promise.then(function(user) {
		if(user) {
			// duplicate exists
			throw error.gen('another user with the same email exists', req);
		}
	}).then( function() {
		User.create(update, function(err, user) {
			if(err) throw err;
			res.json({
				  status: 'GET /user/create'
				, object: 'user'
				, user: user
			});
		});
	},
	function(err) { next(err); });
}

// SHOW
// GET /users/:id/
exports.show = function(req, res, next) {
	var id = req.params.id;
	var query = { _id: id };
	var promise = User.findOne(query)
		.populate('aliases')
		.exec();
	promise.then(function(user) {
		if(!user) throw error.gen('user not found', req);
		return user;
	}).then(function(user) {
		res.json({
			  status: 'GET /user/' + id
			, object: 'user'
			, user: user
		});
	}, function(err) { next(err); });
}

// EDIT
// GET /users/:id/edit
exports.edit = function(req, res, next) {
	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	var update = {};

	User.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;

		update[pathname] = val;
	});

	// if there's a change, set the update date to now
	if(!_.isEmpty(update)) update.updated = new Date();

	// hash password if it exists
	if(update.password) update.password = bcrypt.hashSync(update.password, 8);

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
// PUT/PATCH /users/:id
exports.update = function(req, res, next) {
	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	var update = {};

	User.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;

		update[pathname] = val;
	});

	if(_.isEmpty(update.email) && _.isEmpty(update.open_id)) {
		throw error.gen('missing identifier - email or openid', req);
	}
	else if(_.isEmpty(update.open_id) && _.isEmpty(update.password)) {
		throw error.gen('missing verification - password or openid', req);
	}

	// if there's a change, set the update date to now
	if(!_.isEmpty(update)) update.updated = new Date();

	// hash password if it exists
	if(update.password) update.password = bcrypt.hashSync(update.password, 8);

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
// DELETE /users/:id
exports.destroy = function(req, res, next) {
	var _id = req.params.id;
	var object_id = ObjectId.createFromHexString(_id);

	var query = { _id: object_id };
	User.findOne(query).exec(function(err, user) {
		if(err) throw err;
		return user;
	}).then(function(user) {

		if(!user) {
			var err = error.gen('user not found', req);
			next(err);
		}

		user.remove(function(err, user) {
			if(err) throw err;
			res.json({
				  status: 'DELETE /user' + _id
				, object: 'user'
				, user: user
			});
			next();
		});
	});
}
