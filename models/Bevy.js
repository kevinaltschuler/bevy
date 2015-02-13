'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  _id: Schema.Types.ObjectId // internal id
	, aliases: [Schema.Types.ObjectId]
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
