'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  aliases: [{
	  	  type: Schema.Types.ObjectId
	  	, ref: 'Alias'
	  }]
	, name: String
	, color: String
	, imageURL: String
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
