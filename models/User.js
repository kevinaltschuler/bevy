/**
 * User.js
 *
 * Mongoose models for bevy users
 *
 * @author albert
 */

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
		, emails: [Schema({
			  value: String
			, type: {
				type: String
			}
		}, {
			_id: false
		})]
		, photos: [Schema({
			value: String
		}, {
			_id: false
		})]
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
