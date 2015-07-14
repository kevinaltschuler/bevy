/**
 * ResetToken.js
 *
 * Mongoose model
 * used for resetting a forgotten password
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');

module.exports = new Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate()
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
