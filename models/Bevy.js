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
var _ = require('underscore');

var BevySchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
	},
	name: {
		type: String
	},
	description: {
		type: String
	},
	slug: {
		type: String,
		unique: true
	},
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

BevySchema.virtual('url').get(function() {
	if(_.isEmpty(this.slug)) return ('/b/' + this._id + '/');
	return ('/b/' + this.slug + '/');
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
