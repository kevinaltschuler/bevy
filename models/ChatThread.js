'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatThread = new Schema({
	bevy: {
		type: Schema.Types.ObjectId,
		ref: 'Bevy'
	},
	members: [Schema({
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		member: {
			type: Schema.Types.ObjectId,
			ref: 'BevyMember'
		}
	}, { _id: false })]
});

module.exports = ChatThread;
