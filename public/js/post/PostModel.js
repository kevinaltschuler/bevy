/**
 * PostModel.js
 *
 * post backbone model
 * corresponds (hopefully) with the mongoose model
 * in models/Post.js
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var constants = require('./../constants');

// backbone model
var Post = Backbone.Model.extend({
	defaults: {
		_id: null,
		title: null,
		body: null,
		image_url: null,
		author: null,
		bevy: null,
		comments: [],
		points: [],
		created: new Date(),
		updated: new Date()
	},

	initialize: function() {

	},

	idAttribute: '_id',

	countVotes: function() {
		var sum = 0;
		this.get('points').forEach(function(vote) {
			sum += vote.value;
		});
		return sum;
	}
});
module.exports = Post;
