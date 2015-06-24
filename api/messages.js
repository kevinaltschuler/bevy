'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var emitter = require('./notifications').emitter;

var Message = mongoose.model('ChatMessage');
var Thread = mongoose.model('ChatThread');
var Bevy = mongoose.model('Bevy');
var Member = mongoose.model('BevyMember');

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
	var author = req.body['author'];
	var body = req.body['body'];

	var message = {
		thread: thread_id,
		author: author,
		body: body
	};

	Message.create(message, function(err, $message) {
		Message.populate(message, { path: 'author' }, function(err, $pop_message) {
			// now lets push it to everybody
			Thread.findOne({ _id: thread_id }, function(err, thread) {
				if(err) return next(err);
				if(!thread) return next('thread not found');
				if(_.isEmpty(thread.users)) {
					// send to bevy members
					Member.find({ bevy: thread.bevy }, function(err, members) {
						if(err) return next(err);
						members.forEach(function(member) {
							emitter.emit(member.user + ':chat', $pop_message);
						});
					});
				} else {
					// send to each user
					thread.users.forEach(function(user) {
						emitter.emit(user + ':chat', $pop_message);
					});
				}
			});

			$pop_message = JSON.parse(JSON.stringify($pop_message));
			$pop_message._id = $message._id;
			$pop_message.created = $message.created;
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
