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
var mq = require('./../mq');
var config = require('./../config');

var Post = require('./../models/Post');
var Comment = require('./../models/Comment');
var Board = require('./../models/Board');

var notifications = require('./notifications');

var userPopFields = '_id displayName email image username '
 + 'google facebook created';

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
		Comment.populate(comment, [{
        path: 'postId',
        select: '_id author title board admins settings'
      }, {
        path: 'author',
        select: userPopFields
      }], function(err, pop_comment) {
      mq.pubSock.send([config.mq.events.NEW_COMMENT, JSON.stringify(pop_comment)]);
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
	var comment_id = req.params.commentid;
	Comment.findOneAndRemove({ _id: comment_id }, function(err, comment) {
    if(err) return next(err);
    if(_.isEmpty(comment)) return next('Comment not found');
    //_removeComment(comment);
    return res.json(comment);
  });
};

var _removeComment = function(comment) {
  Comment.remove({ parentId: comment._id }, function(err, comments) {
    if(err) return;
    if(_.isEmpty(comments)) return;
    if(!_.isArray(comments)) comments = [comments];
    for(var key in comments) {
      var $comment = comments[key];
      _removeComment($comment);
    }
  });
};
