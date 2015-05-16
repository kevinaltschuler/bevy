/**
 * Comment.js
 *
 * Comment mongoose model
 *
 * @author albert
 */

'use strict';

// imports
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: 'Alias'
	},
	title: String,
	body: String,
	link: String,
	image_url: String,
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	settings: {
		visibility: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	}
});

module.exports = Comment;
