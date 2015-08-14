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
var shortid = require('shortid');

var post_types = 'default event'.split(' ');

var PostSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
	},
	bevy: {
		type: String,
		ref: 'Bevy'
	},
	author: {
		type: String,
		ref: 'User'
	},
	title: String,
	tags: [String],
	images: [String],
	comments: [{}],
	links: [{}],
	votes: [Schema({
		voter: {
			type: String,
			ref: 'User'
		},
		score: Number
	}, {
		_id: false
	})],
	pinned: {
		type: Boolean,
		default: false
	},
	muted_by: [{
		type: String,
		ref: 'User'
	}],
	expires: {
		type: Date,
		default: new Date('2035', '1', '1'), // expires in a long time
		index: {
			expireAfterSeconds: 5
		}
	},
	type: {
		type: String,
		enum: post_types,
		default: 'default'
	},
	event: {
		date: {
			type: Date
		},
		location: {
			type: String
		},
		description: {
			type: String
		},
		attendees: [{
			type: String,
			ref: 'User'
		}]
	},
	tag: {
		name: {
			type: String
		},
		color: {
			type: String
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
