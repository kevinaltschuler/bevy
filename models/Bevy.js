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

var roles = 'admin mod user'.split(' ');

var BevySchema = new Schema({
	name: String,
	description: String,
	image_url: {
		type: String
	},
	members: [ Schema({
	  	email: {
	  	  	type: String
	  	},
	  	user: {
	  		type: Schema.Types.ObjectId,
	  		ref: 'User'
	  	},
	  	displayName: {
	  		type: String
	  	},
	  	notificationLevel: {
	  		type: String,
	  		default: 'all'
	  	},
	  	role: {
	  		type: String,
	  		enum: roles,
	  		default: 'user'
	  	}

	}, { _id: false }) ],
	settings: {
		visibility: String
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
