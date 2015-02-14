'use strict'

var _ = require('underscore');
var error = require('./../error');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');
var Alias = mongoose.model('Alias');

// INDEX
// GET /users/:id/aliases/
exports.index = function(req, res, next) {
	var user_id = req.params.id;
	var user_object_id = ObjectId.createFromHexString(user_id);

	var user_query = { _id: user_object_id };
	var user_promise = User.findOne(user_query).exec();
	user_promise.then(function(user) {
		if(!user) {
			throw error.gen('user not found', req);
		}

		var aliases = user.aliases;
		res.json({
			  status: 'GET /user/' + user_id + '/aliases/'
			, object: 'alias array'
			, aliases: aliases
		});
	}).then(null, function(err) {
		next(err);
	});
}

// CREATE
// GET /users/:id/aliases/create
// POST /users/:id/aliases
exports.create = function(req, res, next) {
	var user_id = req.params.id;
	var user_object_id = ObjectId.createFromHexString(user_id);

	var user_query = { _id: user_object_id };
	var user_promise = User.findOne(user_query).exec();
	user_promise.then(function(user) {
		if(!user) {
			throw error.gen('user not found', req);
		}
		return user;
	}).then(
	function(user) {
		var update = {};

		Alias.schema.eachPath(function(pathname, schema_type) {
			// collect path value
			var val = null;
			if(req.body != undefined) val = req.body[pathname];
			if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
			if(!val) return;

			update[pathname] = val;
		});

		if(!update.name) throw error.gen('alias name not specified', req);

		update._id = new ObjectId();
		update.created = new Date();
		update.updated = new Date();

		Alias.create(update, function(err, alias) {
			if(err) throw err;

			user.aliases.push(alias);
			user.save(function(err) {
				if(err) throw err;
			});

			res.json({
				  status: 'GET /users/' + user_id + '/aliases/create'
				, object: 'alias'
				, alias: alias
			});
		});
	},
	function(err) {
		next(err);
	}).then(null, function(err) {
		next(err);
	});
}

// SHOW
exports.show = function(req, res, next) {

}

// EDIT
exports.edit = function(req, res, next) {

}

// UPDATE
exports.update = function(req, res, next) {

}

// DESTROY
exports.destroy = function(req, res, next) {

}
