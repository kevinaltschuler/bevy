'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roles = 'admin mod user'.split(' ');

var BevyMemberSchema = new Schema({
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
}, { _id: false });

BevyMemberSchema.set('toObject', {
	getters: true,
	virtuals: true
});
BevyMemberSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = BevyMemberSchema
