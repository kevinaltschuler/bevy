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
	members: [Schema({
		user: {
			type: String,
			ref: 'User'
		},
		member: {
			type: String,
			ref: 'BevyMember'
		}
	}, { _id: false })]
});

module.exports = ChatThread;
