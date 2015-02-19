/**
 * PostActions.js
 *
 * the glue between the front end React components
 * and the back end Backbone models
 *
 * uses the helper dispatch function for clarity of
 * event name
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');


var PostActions = {
	// create a post
	create: function(title, body, image_url, author, bevy) {
		//console.log('creating post action...');
		dispatch('create', {
			  title: (title == undefined) ? 'untitled' : title
			, body: (body == undefined) ? 'nothing here' : body
			, image_url: (image_url == undefined) ? '' : image_url
			, author: (author == undefined) ? 'current author' : author // grab the current, logged in user?
			, bevy: (bevy == undefined) ? 'current bevy' : bevy // grab the current, active bevy
		});
	}
};

module.exports = PostActions;
