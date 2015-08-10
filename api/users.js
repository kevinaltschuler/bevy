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
var async = require('async');

var shortid = require('shortid')
var mailgun = require('./../config').mailgun();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = mongoose.model('User');
var Bevy = mongoose.model('Bevy');
var Post = mongoose.model('Post');
var Notification = mongoose.model('Notification');

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
	update._id = shortid.generate();

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
	}).then(function() {

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

			// push existing notifications
			Notification.update({ email: user.email }, { user: user._id }, { multi: true }, function(err, raw) {

			});

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
// PUT/PATCH /users/:id
exports.update = function(req, res, next) {
	//console.log('update');
	var id = req.params.id;

	var update = {};
	update.updated = new Date();
	if(req.body['bevies'] != undefined) {
		update.bevies = req.body['bevies'];
	}
	if(req.body['image_url'] != undefined) update.image_url = req.body['image_url'];
	// hash password if it exists
	if(update.password) update.password = bcrypt.hashSync(update.password, 8);

	//console.log(update);

	/*User.findOneAndUpdate({ _id: id }, update, { new: true, upsert: true }, function(err, user) {
		if(err) return next(err);
		return res.json(user);
	}).populate('bevies');*/
	var promise = User.findOneAndUpdate({ _id: id }, update, { new: true }).populate('bevies');
	promise.then(function(user) {
		return res.json(user);
	}, function(err) {
		return next(err);
	});
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

// GET /users/:id/contacts
exports.getContacts = function(req, res, next) {
	var id = req.params.id;
	return res.json([]);

	/*async.waterfall([
		function(done) {
			// get bevies the user is a member of
			Bevy.find({ members: { $elemMatch: { user: id } } }, function(err, bevies) {
				done(null, bevies);
			}).populate('members.user');
		},
		function(bevies, done) {
			// get members
			var members = [];
			bevies.forEach(function(bevy) {
				if(bevy.settings.anonymise_users) return;
				bevy.members.forEach(function(member) {
					members.push(member.user);
				});
			});
			// remove dupes
			members = _.uniq(members);

			return res.json(members);
		}
	]);*/
}

// GET /users/google/:id
exports.getGoogle = function(req, res, next) {
	var id = req.params.id;

	User.findOne({ 'google.id': id }, function(err, user) {
		if(err) return next(err);
		return res.json(user);
	});
}

// GET /users/:id/points
exports.points = function(req, res, next) {
	var id = req.params.id;
	Post.find({ votes: { $elemMatch: { voter: id } } }, function(err, posts) {
		if(err) return next(err);
		// add up the points
		var sum = 0;
		posts.forEach(function(post) {
			post.votes.forEach(function(vote) {
				sum += vote.score;
			});
		});
		return res.json({
			score: sum
		});
	});
}


