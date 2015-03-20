'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	  name: String
	, photos: [{ url: String }]
	, karma: Number
	, notifications: [Schema.Types.Mixed] // specify this later
	, created: {
		  type: Date
		, default: Date.now }
	, updated: {
		  type: Date
		, default: Date.now }
});
