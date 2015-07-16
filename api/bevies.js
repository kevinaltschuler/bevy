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
var async = require('async');

var Bevy = mongoose.model('Bevy');
var Member = mongoose.model('BevyMember');
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
	console.log(req.user);

	Member.find({ user: userid }, function(err, members) {
		if(err) return next(err);
		var _bevies = [];
		async.each(members, function(member, callback) {
			var bevy_id = member.bevy._id;
			var bevy = JSON.parse(JSON.stringify(member.bevy));
			Member.find({ bevy: bevy_id }, function(err, $members) {
				bevy.members = $members;
				_bevies.push(bevy);
				callback();
			}).populate('user');
		}, function(err) {
			if(err) return next(err);
			return res.json(_bevies);
		});
	}).populate('bevy');
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
	update.name = req.body['name'] || null;
	update.description = req.body['description'] || '';
	update.image_url = req.body['image_url'] || '';
	update.parent = req.body['parent'] || null;
	var members = req.body['members'] || [];

	if(!update.name) throw error.gen('bevy name not specified', req);

	Bevy.create(update, function(err, bevy) {
		if(err) throw err;
		bevy = bevy.toJSON();
		members.forEach(function(member) {
			member.bevy = bevy._id;
		});
		Member.create(members, function(err, $members) {
			if(err) return next(err);
			bevy.members = $members;
			return res.json(bevy);
		});

		// create chat thread
		ChatThread.create({ bevy: bevy._id }, function(err, thread) {

		});
	});
}

// SHOW
// GET /bevies/:id
exports.show = function(req, res, next) {
	var id = req.params.id;

	//Bevy.findOne({ $or: [{ _id: id }, { name: id }] }, function(err, bevy) {
	Bevy.findOne({ _id: id }, function(err, bevy) {
		if(err) return next(err);
		Member.find({ bevy: id }, function(err, members) {
			if(err) return next(err);
			bevy = JSON.parse(JSON.stringify(bevy));
			bevy.members = members;
			return res.json(bevy);
		}).populate('user');
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
