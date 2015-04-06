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

var POST = require('./../constants').POST;


var PostActions = {

	/**
	 * create a post
	 * @param  {string} title
	 * @param  {string} body
	 * @param  {string} image_url
	 * @param  {string} author
	 * @param  {string} bevy
	 */
	create: function(title, body, image_url, author, bevy) {
		dispatch(POST.CREATE, {
			title: (title == undefined) ? 'untitled' : title,
			body: (body == undefined) ? null : body,
			image_url: (image_url == undefined) ? null : image_url,
			author: (author == undefined) ? null : author, // grab the current, logged in user?
			bevy: (bevy == undefined) ? null : bevy // grab the current, active bevy
		});
	},

	destroy: function(post_id) {
		dispatch(POST.DESTROY, {
			post_id: (post_id == undefined) ? '0' : post_id
		});
	},

	/**
	 * upvote a post
	 * @param  {string} post_id
	 * @param  {string} author
	 */
	upvote: function(post_id, author) {
		dispatch(POST.UPVOTE, {
			post_id: (post_id == undefined) ? 'default' : post_id,
			author: (author == undefined) ? 'current author' : author
		});
	},

	/**
	 * downvote a post
	 * @param  {string} post_id
	 * @param  {string} author
	 */
	downvote: function(post_id, author) {
		dispatch(POST.DOWNVOTE, {
			post_id: (post_id == undefined) ? 'default' : post_id,
			author: (author == undefined) ? 'current author' : author
		});
	},

	/**
	 * sort the list of posts
	 * @param  {string} by        the sorting method ('top', 'new')
	 * @param  {string} direction either 'asc' or 'desc'
	 */
	sort: function(by, direction) {
		dispatch(POST.SORT, {
			by: (by == undefined) ? 'new' : by,
			direction: (direction == undefined) ? 'asc' : direction
		});
	}
};

module.exports = PostActions;
