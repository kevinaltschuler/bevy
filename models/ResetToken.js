/**
 * ResetToken.js
 *
 * used for resetting a forgotten password
 * or when a user creates a new bevy
 *
 * @author albert
 * @flow
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

var ResetTokenSchema = new Schema({
	_id: {
		type: String,
		required: true,
		unique: true,
		default: shortid.generate
	},
	user: {
  	type: String,
  	ref: 'User',
		required: true
	},
	token: {
		type: String,
		required: true
	},
	previousPass: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now,
		required: true
	}
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);
