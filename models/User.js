'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  token: String
	, password: String
	, email: {
		  type: String
		, unique: true
	}
	, google: {
		  provider: String
		, id: String
		, name: {
			  familyName: String
			, givenName: String
			, middleName:String
		}
		, displayName: String
		, token: String
		, emails: [{
			  value: String
			, type: String
		}]
		, photos: [{
			value: String
		}]
	}
	, aliases: [{
		  type: Schema.Types.ObjectId
		, ref: 'Alias'
	  }]
	, created: {
		  type: Date
		, default: Date.now }
	, updated: {
		  type: Date
		, default: Date.now }
});
