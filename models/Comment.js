/**
 * Comment.js
 *
 * Comment mongoose model
 *
 * @author albert
 */

'use strict';

// imports
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
	postId: { // post comment is under
		type: Schema.Types.ObjectId,
		ref: 'Post'
	},
	parentId: { // parent comment, if one exists
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	body: String,
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

module.exports = Comment;
