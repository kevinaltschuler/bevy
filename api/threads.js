'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var shortid = require('shortid');

var Thread = mongoose.model('ChatThread');
var Bevy = mongoose.model('Bevy');
var User = mongoose.model('User');


// GET /users/:id/threads
exports.index = function(req, res, next) {
	var id = req.params.id;

	async.waterfall([
		function(done) {
			User.findOne({ _id: id }, function(err, user) {
				if(err) return next(err);
				return done(null, user);
			}).populate('bevies');
		},
		function(user, done) {
			var bevy_id_list = _.pluck(user.bevies, '_id');

			Thread.find(function(err, threads) {
				if(err) return next(err);
				return res.json(threads);
			})
			.or([{ users: id }, { bevy: { $in: bevy_id_list } }])
			.populate('bevy users');
		}
	]);
}

// GET /bevies/:id/thread
exports.show = function(req, res, next) {
	var id = req.params.id;
	Thread.findOne({ bevy: id }, function(err, thread) {
		if(err) return next(err);
		return res.json(thread);
	}).populate('bevy users');
}


// POST /threads
exports.create = function(req, res, next) {
	var thread = {};
	thread._id = shortid.generate();
	thread.name = req.body['name'];
	thread.image_url = req.body['image_url'];
	thread.type = req.body['type'];
	thread.bevy = req.body['bevy'];
	thread.users = req.body['users'];

	Thread.create(thread, function(err, $thread) {
		if(err) return next(err);
		Thread.populate($thread, 'bevy users', function(err, pop_thread) {
			if(err) return next(err);
			return res.json(pop_thread);
		});
	});
};

// PUT/PATCH /users/:id/threads/:threadid
exports.update = function(req, res, next) {
	var id = req.params.id;
	var thread_id = req.params.threadid;
	var users = req.body['users'] || [];
	var bevy = req.body['bevy'] || null;

	var thread = {
		users: users,
		bevy: bevy
	};

	Thread.findOneAndUpdate({ _id: thread_id }, thread, { upsert: true }, function(err, thread) {
		if(err) return next(err);
		return res.json(thread);
	}).populate('bevy users');
}

// DELETE /users/:id/threads/:threadid
exports.destroy = function(req, res, next) {
	var id = req.params.id;
	var thread_id = req.params.threadid;

	Thread.findOneAndRemove({ _id: thread_id }, function(err, thread) {
		if(err) return next(err);
		return res.json(thread);
	}).populate('bevy users');
}
