'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var shortid = require('shortid');

var emitter = require('./notifications').emitter;

var Message = mongoose.model('ChatMessage');
var Thread = mongoose.model('ChatThread');
var Bevy = mongoose.model('Bevy');
var User = mongoose.model('User');

// GET /threads/:threadid/messages
exports.index = function(req, res, next) {
	var thread_id = req.params.threadid;
	var skip = req.query['skip'] || 0;
	Message.find({ thread: thread_id }, function(err, messages) {
		if(err) return next(err);
		return res.json(messages);
	})
		.populate('author')
		.sort('-created')
		.skip(skip)
		.limit(10);
};

// POST /threads/:threadid/messages
exports.create = function(req, res, next) {
	var thread_id = req.params.threadid;
	var author_id = req.body['author'];
	var body = req.body['body'];

	var message = {
		_id: shortid.generate(),
		thread: thread_id,
		author: author_id,
		body: body
	};

	Message.create(message, function(err, $message) {
		if(err) return next(err);
		Message.populate($message, { path: 'author' }, function(err, $pop_message) {
			if(err) return next(err);
			// now lets push it to everybody
			Thread.findOne({ _id: thread_id }, function(err, thread) {
				if(err) return next(err);
				if(!thread) return next('thread not found');
				if(!_.isEmpty(thread.bevy)) { // if its a bevy chat
					// send to bevy members
					User.find({ bevies: thread.bevy }, function(err, users) {
						if(err) return next(err);
						users.forEach(function(user) {
							if(user._id == author_id) return; // dont send chat to yourself
							emitter.emit(user._id + ':chat', $pop_message);
						});
					});
				}
				// send to each user
				thread.users.forEach(function(user_id) {
					if(user_id == author_id) return; // dont send chat to yourself
					emitter.emit(user_id + ':chat', $pop_message);
				});
			});

			return res.json($pop_message);
		});
	});
};

// PUT/PATCH /threads/:threadid/messages/:id
exports.update = function(req, res, next) {
	var thread_id = req.params.threadid;
	var id = req.params.id;

	// only update body for now... no real need to update thread/author
	var body = req.body['body'];
	var message = {
		body: body
	};
	Message.findOneAndUpdate({ _id: id }, message, { new: true, upsert: true }, function(err, $message) {
		return res.json($message);
	});
};

// DELETE /threads/:threadid/messages/:id
exports.destroy = function(req, res, next) {
	var thread_id = req.params.threadid;
	var id = req.params.id;

	Message.findOneAndRemove({ _id: id }, function(err, message) {
		return res.json(message);
	});
};
