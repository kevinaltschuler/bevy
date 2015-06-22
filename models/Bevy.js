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

var BevySchema = new Schema({
	name: String,
	description: String,
	image_url: {
		type: String
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
