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
		unique: true,
		default: shortid.generate
	},
	user: {
	  	type: String,
	  	ref: 'User'
	},
	token: String,
	previousPass: String,
	created: {
		type: Date,
		default: Date.now,
		expires: 3600
	}
});

module.exports = mongoose.model('ResetToken', ResetTokenSchema);
