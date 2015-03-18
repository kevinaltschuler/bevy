/**
 * Bevy.js
 *
 * Bevy database model
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  name: String
	, color: String
	, imageURL: String
	, members: [{
	  	  email: {
	  	  	type: String
	  	}
	  	, aliasid: {
	  		  type: Schema.Types.ObjectId
	  		, ref: 'Alias'
	  	}
	  }]
	, settings: {
		visibility: String
	}
	, created: {
		  type: Date
		, default: Date.now }
	, updated: {
		  type: Date
		, default: Date.now }
});
