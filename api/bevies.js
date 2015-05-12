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

var client = require('./../mubsub').client();
var channel = client.channel('notifications');

var Bevy = mongoose.model('Bevy');

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
		query = { members: { $elemMatch: { userid: userid } } };
	}

	var promise = Bevy.find(query)
		.populate('members.userid')
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

		// invite users
		if(bevy.members.length > 1) {
			//TODO: grab alias
			//TODO: ignore bevy creator
			channel.publish('invite:email', {
				  members: bevy.members.toObject()
				, bevy: bevy
				, user: {
					name: 'placeholder-creator'
				}
			});
		}

		res.json(bevy);
	});
}

// SHOW
// GET /bevies/:id
exports.show = function(req, res, next) {
	var id = req.params.id;

	var query = { _id: id };
	var promise = Bevy.findOne(query)
		.populate('members.userid')
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

	var query = { _id: id };
	var promise = Bevy.findOneAndUpdate(query, update, { upsert: true })
		.populate('members.userid')
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
		.populate('members.userid')
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
		.populate('members.userid')
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
	var fields = 'email userid notificationLevel';
	fields.split(' ').forEach(function(field) {
		var val = null;
		if(req.body != undefined) val = req.body[field];
		if(!val && !_.isEmpty(req.query)) val = req.query[field];
		if(!val) return;
		update[field] = val;
	});

	var query = { _id: id };
	var promise = Bevy.findOne(query)
		.exec();
	promise.then(function(bevy) {
		if(!bevy) throw error.gen('bevy not found', req);
		return bevy;
	}).then(function(bevy) {
		if(!_.isEmpty(update) && update.email) {
			bevy.members.addToSet(update);
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
