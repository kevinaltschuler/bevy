'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatMessage = new Schema({
	thread: {
		type: Schema.Types.ObjectId,
		ref: 'ChatThread'
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	body: String,
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = ChatMessage;
