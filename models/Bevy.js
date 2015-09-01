/**
 * Bevy.js
 *
 * Bevy database model
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var BevySchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
	},
	name: String,
	description: String,
	image_url: {
		type: String
	},
	subCount: {
		type: Number,
		default: 0
	},
	admins: [{
		type: String,
		ref: 'User'
	}],
	tags: [Schema({
		name: {
			type: String
		},
		color: {
			type: String
		}
	}, {
		_id: false
	})],
	siblings: [{
		type: String,
		ref: 'Bevy'
	}],
	settings: {
		posts_expire_in: {
			type: Number,
			default: -1
		},
		anonymise_users: {
			type: Boolean,
			default: false
		},
		group_chat: {
			type: Boolean,
			default: true
		},
		privacy: {
			type: Number,
			default: 0
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

BevySchema.set('toObject', {
	getters: true,
	virtuals: true
});
BevySchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = BevySchema;
