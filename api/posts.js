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

exports.create = function(req, res, next) {
	var bevy_id = req.params.bevyid;
}

exports.show = function(req, res, next) {

}

exports.update = function(req, res, next) {

}

exports.destroy = function(req, res, next) {

}
