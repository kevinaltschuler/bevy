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
		  id: String
		, name: {
			  familyName: String
			, middleName: String
			, firstName:String
		}
		, displayName: String
		, token: String
		, emails: [String]
		, photos: [String]
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
