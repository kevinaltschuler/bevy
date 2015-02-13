'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  _id: Schema.Types.ObjectId // internal id
	, open_id: String // openid from third-party service, if applicable
	, provider: String // third-party service connected to
	, token: String
	, display_name: String
	, password: String
	, email: String
	, aliases: [Schema.Types.ObjectId]
	, created: {
		  type: Date
		, default: Date.now }
	, updated: {
		  type: Date
		, default: Date.now }
});
