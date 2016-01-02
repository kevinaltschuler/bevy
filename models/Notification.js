/**
 * Notification.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var NotificationSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate
	},
	user: {
		type: String,
		ref: 'User'
	},
	email: String,
	event: String,
	data: {},
	read: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now
	},
	expires: {
		type: Date,
		// expires in a week
		default: function() { return Date.now() + (1000 * 60 * 60 * 24 * 7) },
		index: {
			// 5 seconds after the expiration date is reached - this is an arbitrary number
			expireAfterSeconds: 5
		}
	}
});

NotificationSchema.set('toObject', {
	getters: true,
	virtuals: true
});
NotificationSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = mongoose.model('Notification', NotificationSchema);
