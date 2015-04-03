/**
 * comments.js
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var error = require('./../error');
var _ = require('underscore');
var async = require('async');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

function collectCommentParams(req) {
	var update = {};
	// dynamically load schema values from request object
	Comment.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;
		update[pathname] = val;
	});
	return update;
}

// GET /bevies/:bevyid/posts/:postid/comments
exports.index = function(req, res, next) {
	var postid = req.params.postid;
	var query = { _id: postid };
	var promise = Post.findOne(query)
		.populate('comments')
		.exec();
	promise.then(function(post) {
		var comments = post.comments;
		return res.json(comments);
	}, function(err) {
		return next(err);
	});
}

// GET /bevies/:bevyid/posts/:postid/comments/create
// POST /bevies/:bevyid/posts/:postid/comments/
exports.create = function(req, res, next) {
	var update = collectCommentParams(req);

	if(!update.body) return next(error.gen('comment body not specified'));

	async.waterfall([
		function(done) {
			// create comment
			Comment.create(update, function(err, comment) {
				if(err) return next(err);
				done(null, comment);
			});
		},
		function(comment, done) {
			// add to post
			var postid = req.params.postid;
			var query = { _id: postid };
			var promise = Post.findOne(query).exec();
			promise.then(function(post) {
				post.comments.push(comment._id);
				post.save(function(err) {
					if(err) return next(err);
					return res.json(comment);
				});
			}, function(err) {
				return next(err);
			})
		}
	]);
}

// GET /bevies/:bevyid/posts/:postid/comments/:id
exports.show = function(req, res, next) {
	var id = req.params.id;
	var query = { _id: id };
	var promise = Comment.findOne(query).exec();
	promise.then(function(comment) {
		if(!comment) return next(error.gen('comment not found'));
		return res.json(comment);
	}, function(err) {
		return next(err);
	});
}

// GET /bevies/:bevyid/posts/:postid/comments/:id/edit
// GET /bevies/:bevyid/posts/:postid/comments/:id/update
// PUT /bevies/:bevyid/posts/:postid/comments/:id/
exports.update = function(req, res, next) {
	var update = collectCommentParams(req);
	var id = req.params.id;
	var query = { _id: id };
	var promise = Comment.findOneAndUpdate(query, update).exec();
	promise.then(function(comment) {
		if(!comment) return next(error.gen('comment not found'));
		return res.json(comment);
	}, function(err) {
		return next(err);
	});
}

// GET /bevies/:bevyid/posts/:postid/comments/:id/destroy
// DELETE /bevies/:bevyid/posts/:postid/comments/:id/
exports.destroy = function(req, res, next) {

	async.waterfall([
		function(done) {
			// delete comment
			var id = req.params.id;
			var query = { _id: id };
			var promise = Comment.findOneAndRemove(query).exec();
			promise.then(function(comment) {
				if(!comment) return next(error.gen('comment not found'));
				done(null, comment);
			}, function(err) {
				return next(err);
			});
		},
		function(comment, done) {
			// remove from post
			var postid = req.params.postid;
			var query = { _id: postid };
			var promise = Post.findOne(query).exec();
			promise.then(function(post) {
				post.comments.remove(comment._id);
				post.save(function(err) {
					if(err) return next(err);
					return res.json(comment);
				});
			}, function(err) {
				return next(err);
			});
		}
	]);
}
