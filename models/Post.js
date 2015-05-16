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

var PostSchema = new Schema({
	bevy: {
		type: Schema.Types.ObjectId,
		ref: 'Bevy'
	},
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	title: String,
	link: String,
	image_url: String,
	points: [{
		author: String,
		value: Number
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

// register deep populate plugin
var deepPopulate = require('mongoose-deep-populate');
PostSchema.plugin(deepPopulate, {

});

module.exports = PostSchema;
