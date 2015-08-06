'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var NotificationSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
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

module.exports = NotificationSchema;
