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
// GET /bevies
exports.index = function(req, res, next) {
	var userid = req.params.userid;
	var query = {};
	if (userid) {
		query = { members: { $elemMatch: { user: userid } } };
	}

	var promise = Bevy.find(query)
		.populate('members.user')
		.exec();
	promise.then(function(bevies) {
		res.json(bevies);
	}, function(err) { next(err); });
}

// CREATE
// GET /bevies/create
// POST /bevies
exports.create = function(req, res, next) {
	var update = collectBevyParams(req);
	if(!update.name) throw error.gen('bevy name not specified', req);

	Bevy.create(update, function(err, bevy) {
		if(err) throw err;

		// create chat thread
		ChatThread.create({ bevy: bevy._id }, function(err, thread) {

		});

		res.json(bevy);
	});
}

// SHOW
// GET /bevies/:id
exports.show = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	var promise = Bevy.findOne(query)
		.populate('members.user')
		.exec();
	promise.then(function(bevy) {
		if(!bevy) throw error.gen('bevy not found', req);
		return bevy;
	}).then(function(bevy) {
		res.json(bevy);
	}, function(err) { next(err);	});
}

// UPDATE
// GET /bevies/:id/edit
// GET /bevies/:id/update
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
// GET /bevies/:id/destroy
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


// MEMBER LIST
// GET /bevies/:id/members
exports.memberList = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	var promise = Bevy.findOne(query)
		.populate('members.user')
		.exec();
	promise.then(function(bevy) {
		if(!bevy) throw error.gen('bevy not found', req);
		return bevy;
	}).then(function(bevy) {
		res.json(bevy.members);
	}, function(err) { next(err);	});
}

// MEMBER ADD
// GET /bevies/:id/members/add
// POST /bevies/:id/members
exports.memberAdd = function(req, res, next) {
	var id = req.params.id;

	// collect params
	var update = {};
	var fields = 'email user notificationLevel';
	fields.split(' ').forEach(function(field) {
		var val = null;
		if(req.body != undefined) val = req.body[field];
		if(!val && !_.isEmpty(req.query)) val = req.query[field];
		if(!val) return;
		update[field] = val;
	});

	var query = { _id: id };
	var promise = Bevy.findOne(query)
		.populate('members.user')
		.exec();
	promise.then(function(bevy) {
		if(!bevy) throw error.gen('bevy not found', req);
		return bevy;
	}).then(function(bevy) {
		if(!_.isEmpty(update) && update.email) {
			var invited_member_index = -1;
			// find the existing member
			bevy.members.toObject().forEach(function(member, index) {
				if(member.email == update.email && member.user == null) invited_member_index = index;
			});

			if(invited_member_index == -1) {
				// not found. create one from scratch
				bevy.members.addToSet(update);
			} else {
				// found it. update existing member
				bevy.members.set(invited_member_index, {
					email: update.email,
					user: update.user
				});
			}

			bevy.save(function(err) {
				if(err) return next(err);
				return res.json(bevy.members);
			});

		} else res.json(bevy.members);
	}, function(err) { next(err); });
}

// MEMBER SHOW
// GET /bevies/:id/members/:email
exports.memberShow = function(req, res, next) {

}

// MEMBER REMOVE
// GET /bevies/:id/members/remove
exports.memberRemove = function(req, res, next) {

}
