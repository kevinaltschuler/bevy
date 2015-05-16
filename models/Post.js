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

var Comment = mongoose.model('Comment');

var PostSchema = new Schema({
	bevy: {
		type: Schema.Types.ObjectId,
		ref: 'Bevy'
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	title: String,
	image_url: String,
	points: [{
		author: String,
		value: Number
	}],
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
/*var deepPopulate = require('mongoose-deep-populate');
PostSchema.plugin(deepPopulate, {

});*/

module.exports = PostSchema;
