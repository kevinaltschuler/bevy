/**
 * posts.js
 *
 *	posts resource API
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var Post = mongoose.model('Post');


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
		.populate('bevy')
		.populate('comments')
		.exec();
	promise.then(function(posts) {
		res.json({
			  status: 'INDEX BEVY ' + bevy_id + ' POSTS'
			, object: 'post array'
			, posts: posts
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

		res.json({
			  status: 'CREATE BEVY ' + bevy_id + ' POSTS'
			, object: 'post'
			, post: post
		});
	});
}

exports.show = function(req, res, next) {

}

exports.update = function(req, res, next) {

}

exports.destroy = function(req, res, next) {

}
