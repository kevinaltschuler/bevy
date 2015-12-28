/**
 * comments.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var error = require('./../error');
var _ = require('underscore');
var async = require('async');
var shortid = require('shortid');

var Post = require('./../models/Post');
var Comment = require('./../models/Comment');

var notifications = require('./notifications');

var userPopFields = '_id displayName email image username '
 + 'google.displayName facebook.displayName';

// GET /posts/:postid/comments
exports.getComments = function(req, res, next) {
	var post_id = req.params.postid;
	var promise = Comment.find({ postId: post_id })
		.populate({
			path: 'author',
			select: userPopFields
		})
		.exec();
	promise.then(function(comments) {
		return res.json(comments);
	}, function(err) {
		return next(err);
	});
};

// POST /comments
exports.createComment = function(req, res, next) {
	var update = {};
	update._id = shortid.generate();
	if(req.body['postId'] != undefined)
		update.postId = req.body['postId'];
	if(req.body['parentId'] != undefined)
		update.parentId = req.body['parentId'];
	if(req.body['author'] != undefined)
		update.author = req.body['author'];
	if(req.body['body'] != undefined)
		update.body = req.body['body'];
	if(!update.body) return next('Comment body not specified');

	Comment.create(update, function(err, comment) {
		if(err) return next(err);
		Comment.populate(comment, { path: 'postId author' }, function(err, pop_comment) {
			notifications.make('comment:create', { comment: pop_comment });
		});
		return res.json(comment);
	});
};

// GET /comments/:commentid
exports.getComment = function(req, res, next) {
	var comment_id = req.params.commentid;
	var promise = Comment.findOne({ _id: comment_id })
		.populate({
			path: 'author',
			select: userPopFields
		})
		.exec();
	promise.then(function(comment) {
		if(!comment) return next(error.gen('comment not found'));
		return res.json(comment);
	}, function(err) {
		return next(err);
	});
};

// PUT/PATCH /comments/:commentid/
exports.updateComment = function(req, res, next) {
	var update = {};
	if(req.body['postId'] != undefined) {
		update.postId = req.body['postId'];
	}
	if(req.body['parentId'] != undefined) {
		update.parentId = req.body['parentId'];
	}
	if(req.body['author'] != undefined) {
		update.author = req.body['author'];
	}
	if(req.body['body'] != undefined) {
		update.body = req.body['body'];
	}
	if(!update.body) return next('Comment body not specified');

	var comment_id = req.params.commentid;
	var promise = Comment.findOneAndUpdate({ _id: comment_id }, update)
		.populate({
			path: 'author',
			select: userPopFields
		})
		.exec();
	promise.then(function(comment) {
		if(!comment) return next('comment not found');
		return res.json(comment);
	}, function(err) {
		return next(err);
	});
};

// DELETE /comments/:commentid/
exports.destroyComment = function(req, res, next) {
	var comment_id = req.params.id;
	var promise = Comment.findOneAndRemove({ _id: comment_id }).exec();
	promise.then(function(comment) {
		if(!comment) return next('comment not found');
		return res.json(comment);
	}, function(err) {
		return next(err);
	});
};
