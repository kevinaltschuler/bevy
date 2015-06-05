/**
 * Post.js
 *
 * Post database model
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	bevy: {
		type: Schema.Types.ObjectId,
		ref: 'Bevy'
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	title: String,
	tags: [String],
	images: [String],
	comments: [{}],
	votes: [Schema({
		voter: String,
		score: Number
	}, {
		_id: false
	})],
	pinned: {
		type: Boolean,
		default: false
	},
	muted_by: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	expires: {
		type: Date,
		default: Date.now() + (1000 * 60 * 60 * 24 * 7), // set to one week after post, by default
		index: {
			expireAfterSeconds: 5
		}
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

PostSchema.set('toObject', {
	getters: true,
	virtuals: true
});
PostSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = PostSchema;
