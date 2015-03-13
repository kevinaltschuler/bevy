/**
 * aliases.js
 *
 * Alias database API
 *
 * @author albert
 */

'use strict'

var _ = require('underscore');
var error = require('./../error');
var async = require('async');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Alias = mongoose.model('Alias');
var User = mongoose.model('User');

function collectAliasParams(req) {
	var update = {};
	// dynamically load schema values from request object
	Alias.schema.eachPath(function(pathname, schema_type) {
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
// GET /users/:userid/aliases/
exports.index = function(req, res, next) {
	var userid = req.params.userid;
	var query = { _id: userid };
	var promise = User.findOne(query)
		.populate('aliases')
		.exec();
	promise.then(function(user) {
		res.json(user.aliases);
	}, function(err) {
		return next(err);
	});
}

// CREATE
// GET /users/:userid/aliases/create
// POST /users/:userid/aliases
exports.create = function(req, res, next) {
	// collect alias name
	var update = collectAliasParams(req);
	if(!update.name) return next(error.gen('alias name not specified'));

	async.waterfall([
		function(done) {
			// first create the alias document
			// and pass it off to be added to the user
			Alias.create({
				name: update.name
			}, function(err, alias) {
				if(err) return next(err);
				done(null, alias);
			});
		},
		function(alias, done) {
			// get user doc
			var userid = req.params.userid;
			var query = { _id: userid };
			var promise = User.findOne(query).exec();

			promise.then(function(user) {
				// add new alias to user's list
				user.aliases.push(alias._id);
				// save the user
				user.save(function(err) {
					if(err) return next(err);
					// return the alias object
					res.json(alias);
				});
			}, function(err) {
				return next(err);
			});
		}
	]);
}

// SHOW
// GET /users/:userid/aliases/:id
exports.show = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	var promise = Alias.findOne(query).exec();
	promise.then(function(alias) {
		if(!alias) return next(error.gen('alias not found'));
		return alias;
	}).then(function(alias){
		res.json(alias);
	}, function(err) {
		return next(err);
	});
}

// UPDATE
// GET /users/:userid/aliases/:id/edit
// POST /users/:userid/aliases/:id
// GET /users/:userid/aliases/:id/update
exports.update = function(req, res, next) {
	var id = req.params.id;
	var update = collectAliasParams(req);

	var query = { _id: id };
	var promise = Alias.findOneAndUpdate(query, update).exec();
	promise.then(function(alias) {
		if(!alias) throw error.gen('alias not found');
		return alias;
	}).then(function(alias) {
		res.json(alias);
	}, function(err) {
		return next(err);
	});
}

// DESTROY
// GET /users/:userid/aliases/:id/destroy
// DELETE /users/:userid/aliases/:id
exports.destroy = function(req, res, next) {

	async.waterfall([
		function(done) {
			// get alias
			var id = req.params.id;
			var query = { _id: id };
			var promise = Alias.findOneAndRemove(query).exec();
			promise.then(function(alias) {
				// pass alias object off to user query
				//res.json(alias);
				done(null, alias);
			}, function(err) {
				return next(err);
			});
		},
		function(alias, done) {
			// get user
			var userid = req.params.userid;
			var query = { _id: userid };
			var promise = User.findOne(query)
				.exec();
			// remove alias from user's alias array
			promise.then(function(user) {
				user.aliases.remove(alias._id);
				// return alias object
				user.save(function(err) {
					if(err) next(err);
					return res.json(alias);
				});
			}, function(err) {
				return next(err);
			})
		}
	]);
}
