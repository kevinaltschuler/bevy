/**
 * threads.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var shortid = require('shortid');

var Thread = require('./../models/Thread');
var Bevy = require('./../models/Bevy');
var User = require('./../models/User');
var Message = require('./../models/Message');

var userPopFields = '_id displayName email image username '
 + 'google.displayName facebook.displayName';
var bevyPopFields = '_id name slug image admins settings';
var boardPopFields = '_id name image admins settings parent description'

// GET /users/:userid/threads
exports.getUserThreads = function(req, res, next) {
	var user_id = req.params.userid;
	async.waterfall([
		function(done) {
			User.findOne({ _id: user_id }, function(err, user) {
				if(err) return next(err);
				return done(null, user);
			})
			.lean();
		},
		function(user, done) {
			Thread.find({ $or: [{ users: user_id }, { board: { $in: user.boards } }]},
			function(err, threads) {
				if(err) return next(err);
				var $threads = [];
				async.each(threads, function(thread, callback) {
					Message.find({ thread: thread._id }, function(err, latest) {
			      if(err) return next(err);
			      latest = JSON.parse(JSON.stringify(latest));
			      thread.latest = latest[0];
			      $threads.push(thread);
			      callback();
			    })
			    .limit(1)
			    .sort('-created')
			    .populate({
						path: 'author',
						select: userPopFields
					});
				},
				function(err) {
					if(err) return next(err);
					else return res.json($threads);
				});
			})
			.populate({
				path: 'board',
				select: boardPopFields
			})
			.populate({
				path: 'users',
				select: userPopFields
			});
		}
	]);
}

// GET /boards/:boardid/thread
exports.getBoardThreads = function(req, res, next) {
	var board_id = req.params.boardid;
	Thread.findOne({ board: board_id }, function(err, thread) {
		if(err) return next(err);
	    Message.find({ thread: thread._id }, function(err, latest) {
	      if(err) return next(err);
	      thread.latest = latest;
	      return res.json(thread);
	    })
	    .populate('created')
	    .sort('-created')
	    .limit(1)
		.populate({
			path: 'author',
			select: userPopFields
		});
	})
	.populate({
		path: 'board',
		select: boardPopFields
	})
	.populate({
		path: 'users',
		select: userPopFields
	});
}


// POST /threads
exports.createThread = function(req, res, next) {
	var thread = {};
	thread._id = shortid.generate();
	thread.name = req.body['name'];
	thread.image = req.body['image'];
	thread.type = req.body['type'];
	thread.board = req.body['board'];
	thread.users = req.body['users'];

	Thread.create(thread, function(err, $thread) {
		if(err) return next(err);
		Thread.populate($thread, 'board users', function(err, pop_thread) {
			if(err) return next(err);
			return res.json(pop_thread);
		});
	});
};

// GET /threads/:threadid
exports.getThread = function(req, res, next) {
	var thread_id = req.params.threadid;
	Thread.findOne({ _id: thread_id }, function(err, thread) {
		if(err) return next(err);
		return res.json(thread);
	})
	.populate({
		path: 'board',
		select: boardPopFields
	})
	.populate({
		path: 'users',
		select: userPopFields
	})
	.lean()
};

// PUT/PATCH /threads/:threadid
exports.updateThread = function(req, res, next) {
	var thread_id = req.params.threadid;
	var thread = {};
	if(req.body['users'] != undefined)
		thread.users = req.body['users'];
	if(req.body['board'] != undefined)
		thread.board = req.body['board'];
	if(req.body['type'] != undefined)
		thread.type = req.body['type'];
	if(req.body['name'] != undefined)
		thread.name = req.body['name'];
	if(req.body['image'] != undefined)
		thread.image = req.body['image'];

	var promise = Thread.findOneAndUpdate({ _id: thread_id }, thread, { new: true })
		.populate({
			path: 'board',
			select: boardPopFields
		})
		.populate({
			path: 'users',
			select: userPopFields
		})
		.exec();
	promise.then(function($thread) {
		return res.json($thread);
	}, function(err) { return next(err); })
}

// DELETE /threads/:threadid
exports.destroyThread = function(req, res, next) {
	var thread_id = req.params.threadid;
	Thread.findOneAndRemove({ _id: thread_id }, function(err, thread) {
		if(err) return next(err);
		return res.json(thread);
	});
}
