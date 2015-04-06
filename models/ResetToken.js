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

module.exports = new Schema({
	user: {
	  	type: Schema.Types.ObjectId,
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
