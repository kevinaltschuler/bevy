'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var Message = mongoose.model('ChatMessage');
var Thread = mongoose.model('ChatThread');

// GET /threads/:threadid/messages
exports.index = function(req, res, next) {
	var thread_id = req.params.threadid;
	Message.find({ thread: thread_id }, function(err, messages) {
		return res.json(messages);
	});
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
		return res.json($message);
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
