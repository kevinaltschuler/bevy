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

var Member = require('./BevyMember');

var BevySchema = new Schema({
	name: String,
	description: String,
	image_url: {
		type: String
	},
	members: [ Member ],
	settings: {
		posts_expire_in: {
			type: Number,
			default: 7
		},
		anonymise_users: {
			type: Boolean,
			default: false
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
