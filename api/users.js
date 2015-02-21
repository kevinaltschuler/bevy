//TODO: AUTH
//TODO: PAGINATION

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

	var promise = User.findOne({ email: update.email })
		.populate('aliases')
		.exec();
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
	var id = req.params.id;

	var update = {};
	User.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;
		update[pathname] = val;
	});

	update.updated = new Date();
	// hash password if it exists
	if(update.password) update.password = bcrypt.hashSync(update.password, 8);

	var query = { _id: id };
	var promise = User.findOneAndUpdate(query, update)
		.populate('aliases')
		.exec()
	promise.then(function(user) {
		res.json({
			  status: 'GET /user/' + id + '/edit'
			, object: 'user'
			, user: user
		});
	}, function(err) { next(err); });
}

// UPDATE
// get /users/:id/update
// PUT/PATCH /users/:id
exports.update = function(req, res, next) {
	var id = req.params.id;

	var update = {};
	User.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;
		update[pathname] = val;
	});

	if(_.isEmpty(update.email))
		throw error.gen('missing identifier - email or openid', req);
	else if(_.isEmpty(update.password))
		throw error.gen('missing verification - password or openid', req);

	// if there's a change, set the update date to now
	update.updated = new Date();
	// hash password if it exists
	if(update.password) update.password = bcrypt.hashSync(update.password, 8);

	var query = { _id: id };
	var promise = User.findOneAndUpdate(query, update)
		.populate('aliases')
		.exec()
	promise.then(function(user) {
		res.json({
			  status: 'PUT/PATCH /user/' + id
			, object: 'user'
			, user: user
		});
	}, function(err) { next(err); });
}

// DESTROY
// DELETE /users/:id
exports.destroy = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	var promise = User.findOne(query)
		.populate('aliases')
		.exec();
	promise.then(function(user) {
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
		});
	}).then(null, function(err) { next(err); });
}
