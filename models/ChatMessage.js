'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var ChatMessage = new Schema({
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

module.exports = ChatMessage;
