'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var emitter = require('./notifications').emitter;

var Message = mongoose.model('ChatMessage');
var Thread = mongoose.model('ChatThread');
var Bevy = mongoose.model('Bevy');

// GET /threads/:threadid/messages
exports.index = function(req, res, next) {
	var thread_id = req.params.threadid;
	Message.find({ thread: thread_id }, function(err, messages) {
		return res.json(messages);
	}).populate('author');
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
				if(_.isEmpty(thread.users)) {
					// send to bevy members
					Bevy.findOne({ _id: thread.bevy }, function(err, bevy) {
						bevy.members.forEach(function(member) {
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
