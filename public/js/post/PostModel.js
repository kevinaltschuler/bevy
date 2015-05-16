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
		body: null,
		image_url: null,
		author: null,
		bevy: null,
		votes: [],
		created: new Date(),
		updated: new Date()
	},

	initialize: function() {
	},

	idAttribute: '_id',

	countVotes: function() {
		var sum = 0;
		this.get('votes').forEach(function(vote) {
			sum += vote.score;
		});
		return sum;
	}
});
module.exports = Post;
