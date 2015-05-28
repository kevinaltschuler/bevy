//TODO: AUTH
//TODO: PAGINATION

/**
 * users.js
 *
 * API for users
 *
 * @author albert
 */

'use strict';

var _ = require('underscore');
var error = require('./../error');
var bcrypt = require('bcryptjs');

var mailgun = require('./../config').mailgun();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');

function collectUserParams(req) {
	var update = {};
	User.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;
		update[pathname] = val;
	});
	return update;
}

// INDEX
// GET /users
exports.index = function(req, res, next) {
	var promise = User.find()
		.populate('aliases')
		.exec();
	promise.then(function(users) {
		res.json(users);
	}, function(err) { next(err); });
}

// CREATE
// GET /users/create
// POST /users
exports.create = function(req, res, next) {
	//TODO: check for dupes
	//TODO: verify email
	var update = collectUserParams(req);

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

		// if it's a test, dont actually create the user, and return the
		// update object
		if(!_.isEmpty(req.query['test']) || !_.isEmpty(req.body['test'])) {
			res.json(update);
			next();
			return;
		}

		User.create(update, function(err, user) {
			if(err) throw err;

			// send a welcome email
			if(req.query['send_email'] == true || req.body['send_email'] == true) {
				mailgun.messages().send({
					  from: 'Bevy Team <contact@joinbevy.com>'
					, to: user.email
					, subject: 'Welcome to Bevy!'
					, text: 'Thanks for signing up for bevy! A prettier template is coming soon.'
				});
			}

			res.json(user);
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
		res.json(user);
	}, function(err) { next(err); });
}

// UPDATE
// GET /users/:id/edit
// GET /users/:id/update
// PUT/PATCH /users/:id
exports.update = function(req, res, next) {
	var id = req.params.id;

	var update = collectUserParams(req);
	update.updated = new Date();
	// hash password if it exists
	if(update.password) update.password = bcrypt.hashSync(update.password, 8);

	var query = { _id: id };
	var promise = User.findOneAndUpdate(query, update)
		.populate('aliases')
		.exec();
	promise.then(function(user) {
		if(!user) throw error.gen('user not found', req);
		return user;
	}).then(function(user) {
		res.json(user);
	}, function(err) { next(err); });
}

// DESTROY
// DELETE /users/:id
exports.destroy = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	var promise = User.findOneAndRemove(query)
		.populate('aliases')
		.exec();
	promise.then(function(user) {
		if(!user) throw error.gen('user not found', req);
		return user;
	}).then(function(user) {
		res.json(user);
	}, function(err) { next(err); });
}
