'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var ChatThread = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
	},
	bevy: {
		type: String,
		ref: 'Bevy'
	},
	users: [{
		type: String,
		ref: 'User'
	}]
});

module.exports = ChatThread;
