'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  _id: Schema.Types.ObjectId // internal id
	, name: String
	, photos: [{ url: String }]
	, karma: Number
	, created: {
		  type: Date
		, default: Date.now }
	, updated: {
		  type: Date
		, default: Date.now }
});
