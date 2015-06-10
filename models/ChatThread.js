'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatThread = new Schema({
	bevy: {
		type: Schema.Types.ObjectId,
		ref: 'Bevy'
	},
	users: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = ChatThread;
