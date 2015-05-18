/**
 * posts.js
 *
 *	posts resource API
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

function collectPostParams(req) {
	var update = {};
	// dynamically load schema values from request object
	Post.schema.eachPath(function(pathname, schema_type) {
		// collect path value
		var val = null;
		if(req.body != undefined) val = req.body[pathname];
		if(!val && !_.isEmpty(req.query)) val = req.query[pathname];
		if(!val) return;
		update[pathname] = val;
	});
	return update;
}

// INDEX
// GET /bevies/:bevyid/posts
exports.index = function(req, res, next) {
	var bevy_id = req.params.bevyid;

	var query = { bevy: bevy_id };
	var promise = Post.find(query)
		.populate('bevy author')
		.exec();
	promise.then(function(posts) {

		if(posts.length <= 0) return res.json(posts);

		var _posts = [];

		posts.forEach(function(post) {
			Comment.find({ postId: post._id }, function(err, comments) {
				post = post.toObject();
				post.comments = comments;
				_posts.push(post);
				if(_posts.length == posts.length) return res.json(_posts);
			}).populate('author');
		});

	}, function(err) { next(err); });
}

// CREATE
// GET /bevies/:bevyid/posts/create
// POST /bevies/:bevyid/posts
exports.create = function(req, res, next) {
	var bevy_id = req.params.bevyid;
	var update = collectPostParams(req);
	update.bevy = bevy_id;

	Post.create(update, function(err, post) {
		if(err) throw err;
		// populate bevy
		Post.populate(post, { path: 'bevy author' }, function(err, pop_post) {
			res.json(pop_post);
		});
	});
}

// SHOW
// GET /bevies/:bevyid/posts/:id
exports.show = function(req, res, next) {
	var bevy_id = req.params.bevyid;
	var id = req.params.id;

	var query = { _id: id };
	var promise = Post.findOne(query)
		.populate('bevy author')
		.exec();
	promise.then(function(post) {
		if(!post) throw error.gen('post not found');
		return post;
	}).then(function(post) {

		var _promise = Comment.find({ postId: post._id })
			.populate('author')
			.exec();
		_promise.then(function(comments) {
			post = post.toObject();
			post.comments = comments;
			return res.send(post);
		}, function(err) { return next(err) });

	}, function(err) { next(err); });
}

// UPDATE
// GET /bevies/:bevyid/posts/:id/update
// GET /bevies/:bevyid/posts/:id/edit
// PUT/PATCH /bevies/:bevyid/posts/:id
exports.update = function(req, res, next) {
	var bevy_id = req.params.id;
	var id = req.params.id;
	var update = collectPostParams(req);

	// var query = { _id: id, bevy: bevy_id };
	var query = { _id: id };
	var promise = Post.findOneAndUpdate(query, update)
		.populate('bevy author')
		.exec();
	promise.then(function(post) {
		if(!post) throw error.gen('post not found');
		return post;
	}).then(function(post) {
		res.json(post);
	}, function(err) { next(err); });
}

// DESTROY
// GET /bevies/:bevyid/posts/:id/destroy
// DELETE /bevies/:bevyid/posts/:id
exports.destroy = function(req, res, next) {
	var bevy_id = req.params.id;
	var id = req.params.id;

	// var query = { _id: id, bevy: bevy_id };
	var query = { _id: id };
	var promise = Post.findOneAndRemove(query)
		.populate('bevy author')
		.exec();
	promise.then(function(post) {
		if(!post) throw error.gen('post not found');
		return post;
	}).then(function(post) {
		res.json(post);
	}, function(err) { next(err); });
}
