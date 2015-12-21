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
var ImageSchema = require('./ImageSchema');
var Event = require('./Event');

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
			expireAfterSeconds: 5 // 5 seconds after the expiration date is reached - this is an arbitrary number
		}
	},
	type: {
		type: String,
		enum: post_types,
		default: 'default'
	},
	event: Event,
	tag: {
		name: {
			type: String
		},
		color: {
			type: String
		}
	},
	edited: {
		type: Boolean,
		default: false
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
