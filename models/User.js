'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  _id: Int
	, profile: Schema.Types.Mixed
	, token: String
	, first_name: String
	, last_name: String
	, display_name: String
	, password: String
	, email: String
	, approved: Boolean
	, banned: Boolean
	, role: String
	, photo_url: String
	, created: {
		  type: Date
		, default: Date.now }
	, updated: {
		  type: Date
		, default: Date.now }
});
