/**
 * Post.js
 *
 * Post database model
 *
 * @author albert
 */

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
	 bevy: {
		  type: Schema.Types.ObjectId
		, ref: 'Bevy'
	}
	, comments: [{
		  type: Schema.Types.ObjectId
		, ref: 'Comment'
	}]
	, author: {
		  type: Schema.Types.ObjectId
		, ref: 'Alias'
	}
	, title: String
	, body: String
	, link: String
	, imageURL: String
	, points: [{
		  author: String
		, value: Number
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
