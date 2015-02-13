'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  _id: Schema.Types.ObjectId // internal id
	, author: Schema.Types.ObjectId // alias
	, title: String
	, body: String
	, link: String
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
