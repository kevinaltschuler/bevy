/**
 * Post.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var ImageSchema = require('./ImageSchema');

var post_types = ['default'];

var PostSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate
	},
	bevy: {
		type: String,
		ref: 'Bevy'
	},
	board: {
		type: String,
		ref: 'Board',
		required: true
	},
	author: {
		type: String,
		ref: 'User',
		required: true
	},
	title: {
		type: String
	},
	images: [ ImageSchema ],
	comments: [{}],
	votes: [Schema({
		voter: {
			type: String,
			ref: 'User'
		},
		score: Number
	}, {
		_id: false
	})],
	score: {
		type: Number,
		default: 0
	},
	pinned: {
		type: Boolean,
		default: false
	},
	expires: {
		type: Date,
		default: new Date('2035', '1', '1'), // expires in a long time
		index: {
			// 5 seconds after the expiration date is reached - this is an arbitrary number
			expireAfterSeconds: 5
		}
	},
	type: {
		type: String,
		enum: post_types,
		default: 'default',
		required: true
	},
	edited: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now,
		required: true
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

PostSchema.index({
  title: 'text',
	'event.description': 'text'
});

PostSchema.set('toObject', {
	getters: true,
	virtuals: true
});
PostSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = mongoose.model('Post', PostSchema);
