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

module.exports = new Schema({
	name: String,
	description: String,
	color: String,
	imageURL: {
		type: String
	},
	members: [ Schema({
	  	email: {
	  	  	type: String
	  	},
	  	userid: {
	  		type: Schema.Types.ObjectId,
	  		ref: 'User'
	  	},
	  	notificationLevel: {
	  		type: String,
	  		default: 'all'
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
