'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	, open_id: String // openid from third-party service, if applicable
	, provider: String // third-party service connected to
	, token: String
	, password: String
	, email: {
		  type: String
		, required: true
		, unique: true
	}
	, aliases: [Schema.Types.ObjectId]
	, created: {
		  type: Date
		, default: Date.now }
	, updated: {
		  type: Date
		, default: Date.now }
});
