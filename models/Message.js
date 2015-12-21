/**
 * ChatMessage.js
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var MessageSchema = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
	},
	thread: {
		type: String,
		ref: 'ChatThread'
	},
	author: {
		type: String,
		ref: 'User'
	},
	body: String,
	created: {
		type: Date,
		default: Date.now
	}
});

MessageSchema.set('toObject', {
  getters: true,
  virtuals: true
});
MessageSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

module.exports = mongoose.model('Message', MessageSchema);
