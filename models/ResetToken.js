/**
 * ResetToken.js
 * used for resetting a forgotten password
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
		required: true,
		expires: 60 * 60 * 24 * 7 // expires in a week
	}
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);
