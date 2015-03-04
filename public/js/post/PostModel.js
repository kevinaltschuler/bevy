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

var constants = require('./../constants');

// backbone model
module.exports = Backbone.Model.extend({
	defaults: {
		  _id: null
		, title: null
		, body: null
		, image_url: null
		, author: 'placeholder-author'
		, bevy: null
		, comments: []
		, points: []
		, created: 0
		, updated: 0
	},

	idAttribute: '_id',

	// where to send the CRUD calls (create, read, update, delete)
	//url: function() {
	//	return (this.id) ? constants.apiurl + '/posts/' + this.id : constants.apiurl + '/posts/';
	//},

	countVotes: function() {
		var sum = 0;
		this.get('points').forEach(function(vote) {
			sum += vote.value;
		});
		return sum;
	}
});
