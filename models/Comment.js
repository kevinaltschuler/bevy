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

var CommentSchema = new Schema({
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

CommentSchema.set('toObject', {
	getters: true,
	virtuals: true
});
CommentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});


module.exports = CommentSchema;
