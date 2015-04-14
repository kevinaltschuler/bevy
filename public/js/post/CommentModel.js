/**
 * CommentModel.js
 *
 * @author albert
 */

'use strict'

// imports
var Backbone = require('backbone');
var _ = require('underscore');

// backbone model
var Comment = Backbone.Model.extend({
	defaults: {
		_id: null,
		title: null,
		body: null,
		link: null,
		image_url: null,
		settings: null,
		created: new Date(),
		updated: new Date()
	}
});

module.exports = Comment;
