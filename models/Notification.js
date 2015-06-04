'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	email: String,
	event: String,
	data: {}
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
