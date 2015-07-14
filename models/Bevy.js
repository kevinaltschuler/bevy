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
	parent: {
		type: String,
		ref: 'Bevy'
	},
	settings: {
		posts_expire_in: {
			type: Number,
			default: 7
		},
		anonymise_users: {
			type: Boolean,
			default: false
		},
		group_chat: {
			type: Boolean,
			default: true
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
