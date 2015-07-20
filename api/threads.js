'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');

var Thread = mongoose.model('ChatThread');
var Bevy = mongoose.model('Bevy');
var Member = mongoose.model('BevyMember');


// GET /users/:id/threads
exports.index = function(req, res, next) {
	var id = req.params.id;

	/*async.waterfall([
		function(done) {
			Member.find({ user: id }, function(err, members) {
				if(err) return next(err);
				var _bevies = [];
				async.each(members, function(member, $callback) {
					_bevies.push(member.bevy);
					$callback();
				}, function(err) {
					if(err) return next(err);
					done(null, _bevies);
				});
			}).populate('bevy');
		},
		function(bevies, done) {
			var bevy_id_list = _.pluck(bevies, '_id');

			Thread.find(function(err, threads) {
				if(err) return next(err);
				return res.json(threads);
			})
			.or([{ members: { $elemMatch: { user: id } } }, { bevy: { $in: bevy_id_list } }])
			.populate('bevy members.user members.member');
		}
	]);*/
	return res.json([]);
}

// GET /bevies/:id/thread
exports.show = function(req, res, next) {
	var id = req.params.id;
	Thread.findOne({ bevy: id }, function(err, thread) {
		if(err) return next(err);
		return res.json(thread);
	}).populate('bevy');
}


// POST /users/:id/threads
exports.create = function(req, res, next) {
	var id = req.params.id;
	var members = req.body['members'] || [];
	var bevy = req.body['bevy'] || null;

	var thread = {
		members: members,
		bevy: bevy,
		_id: shortid.generate
	};
	Thread.create(thread, function(err, $thread) {
		if(err) return next(err);
		Thread.populate($thread, { path: 'bevy members.user members.member' }, function(err, pop_thread) {
			if(err) return next(err);

			pop_thread = JSON.parse(JSON.stringify(pop_thread));
			pop_thread._id = $thread._id;
			pop_thread.created = $thread.created;
			return res.json(pop_thread);
		});
	});
}

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
	}).populate('bevy members.user members.member');
}

// DELETE /users/:id/threads/:threadid
exports.destroy = function(req, res, next) {
	var id = req.params.id;
	var thread_id = req.params.threadid;

	Thread.findOneAndRemove({ _id: thread_id }, function(err, thread) {
		if(err) return next(err);
		return res.json(thread);
	}).populate('bevy members.user members.member');
}
