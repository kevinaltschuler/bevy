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
var shortid = require('shortid'); 
var async = require('async');

var User = mongoose.model('User');
var Bevy = mongoose.model('Bevy');
Bevy.collection.ensureIndex({name: 'text'}, function(err) { return err });

var ChatThread = mongoose.model('ChatThread');

function collectBevyParams(req) {
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
	return update;
}

// INDEX
// GET /users/:userid/bevies
exports.index = function(req, res, next) {
	var userid = req.params.userid;
	//console.log(req.user);
	User.findOne({ _id: userid }, function(err, user) {
		if(err) return next(err);
		Bevy.find({ _id: { $in: user.bevies } }, function(err, bevies) {
			if(err) return next(err);
			return res.json(bevies);
		});
	});	
}

//INDEX
//GET /bevies
exports.indexPublic = function(req, res, next) {
	Bevy.find({parent: null}, function(err, bevies) {
		if(err)
			return next(err);
		else
			return res.json(bevies);
	})
		.populate('parent')
		.limit(20);
}

// CREATE
// POST /bevies
exports.create = function(req, res, next) {
	var update = {};
	update._id = shortid.generate();
	update.name = req.body['name'] || null;
	update.description = req.body['description'] || '';
	update.image_url = req.body['image_url'] || '';
	update.parent = req.body['parent'] || null;
	update.admins = req.body['admins'] || [];

	if(!update.name) throw error.gen('bevy name not specified', req);

	Bevy.create(update, function(err, bevy) {
		if(err) throw err;
		// create chat thread
		ChatThread.create({ bevy: bevy._id }, function(err, thread) {

		});
		return res.json(bevy);
	});
}

// SHOW
// GET /bevies/:id
exports.show = function(req, res, next) {
	var id = req.params.id;

	//Bevy.findOne({ $or: [{ _id: id }, { name: id }] }, function(err, bevy) {
	Bevy.findOne({ _id: id }, function(err, bevy) {
		if(err) return next(err);
		return res.json(bevy);
		/*Member.find({ bevy: id }, function(err, members) {
			if(err) return next(err);
			bevy = JSON.parse(JSON.stringify(bevy));
			bevy.members = members;
			return res.json(bevy);
		}).populate('user');*/
	});
}

// SEARCH
// GET /bevies/search/:query
exports.search = function(req, res, next) {
	var query = req.params.query;
	Bevy.find(
		{ $text: { $search: query, $language: "english" }},
		{ score: { $meta: "textScore"}}
	)
	.sort({ score : { $meta : "textScore" } })
    .exec(function(err, results) {
        if(err) return next(err);
        return res.json(results);
    });
}

// UPDATE
// PUT/PATCH /bevies/:id
exports.update = function(req, res, next) {
	var id = req.params.id;

	var update = collectBevyParams(req);
	if(req.body['settings']) {
		update.settings = req.body['settings'];
		if(update.settings.group_chat) {
			// group chat was enabled, create thread
			// use update func so we dont create one if it already exists
			ChatThread.update({ bevy: id }, { bevy: id }, { upsert: true }, function(err, thread) {

			});
		} else {
			// group chat was disabled, destroy thread
			ChatThread.findOneAndRemove({ bevy: id }, function(err, thread) {

			});
		}
	}

	var query = { _id: id };
	var promise = Bevy.findOneAndUpdate(query, update, { new: true, upsert: true })
		.populate('members.user')
		.exec();
	promise.then(function(bevy) {
		if(!bevy) throw error.gen('bevy not found', req);
		return bevy;
	}).then(function(bevy) {
		res.json(bevy);
	}, function(err) { next(err); });
}

// DESTROY
// DELETE /bevies/:id
exports.destroy = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	var promise = Bevy.findOneAndRemove(query)
		.populate('members.user')
		.exec();
	promise.then(function(bevy) {
		res.json(bevy);
	}, function(err) { next(err); })
}

// GET /bevies/:id/subbevies
exports.getSubbevies = function(req, res, next) {
	var id = req.params.id;

	Bevy.find({ parent: id }, function(err, bevies) {
		if(err) return next(err);
		return res.json(bevies);
	});
};

exports.countSubscribers = function(req, res, next) {
	var id = req.params.id;
	return User.count({bevies: [id]});
};