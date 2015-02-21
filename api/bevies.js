/**
 * bevies.js
 *
 * API for bevies
 *
 * @author albert
 */

'use strict';

// imports
var mongoose = require('mongoose');
var error = require('./../error');
var _ = require('underscore');

var Bevy = mongoose.model('Bevy');

// INDEX
// GET /bevies
exports.index = function(req, res, next) {
	Bevy.find().exec(function(err, bevies) {
		if(err) throw err;
		return bevies;
	}).then(function(bevies) {
		res.json({
			  status: 'INDEX BEVIES'
			, object: 'bevy array'
			, bevies: bevies
		});
	}, function(err) { next(err); });
}

// CREATE
// GET /bevies/create
// POST /bevies
exports.create = function(req, res, next) {

	var update = {};
	// dynamically load schema values from request object
	Bevy.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;
		update[pathname] = val;
	});

	if(!update.name) throw error.gen('bevy name not specified', req);

	// set dates
	update.created = new Date();
	update.updated = new Date();

	Bevy.create(update, function(err, bevy) {
		if(err) throw err;

		res.json({
			  status: 'CREATE BEVIES'
			, object: 'bevy'
			, bevy: bevy
		});
	});
}

// SHOW
exports.show = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	Bevy.findOne(query).exec(function(err, bevy) {
		if(err) throw err;

		if(!bevy) throw error.gen('bevy not found', req);
		return bevy;
	}).then(function(bevy) {
		res.json({
			  status: 'SHOW BEVIES'
			, object: 'bevy'
			, bevy: bevy
		});
	}, function(err) {
		next(err);
	});

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
