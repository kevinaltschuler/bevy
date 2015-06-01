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

	fetch: function(bevy) {
		dispatch(POST.FETCH, {
			bevy: (bevy == undefined) ? null : bevy
		});
	},


	/**
	 * create a post
	 * @param  {string} title
	 * @param  {string} image_url
	 * @param  {string} author
	 * @param  {string} bevy
	 */
	create: function(title, images, author, bevy, active_member) {
		dispatch(POST.CREATE, {
			title: (title == undefined) ? 'untitled' : title,
			images: (images == undefined) ? null : images,
			author: (author == undefined) ? null : author, // grab the current, logged in user?
			bevy: (bevy == undefined) ? null : bevy, // grab the current, active bevy
			active_member: (active_member == undefined) ? {} : active_member
		});
	},

	destroy: function(post_id) {
		dispatch(POST.DESTROY, {
			post_id: (post_id == undefined) ? '0' : post_id
		});
	},

	update: function(post_id, postTitle) {
		dispatch(POST.UPDATE, {
			post_id: (post_id == undefined) ? '0' : post_id,
			postTitle: (postTitle == undefined) ? '' : postTitle
		});
	},

	/**
	 * upvote a post
	 * @param  {string} post_id
	 * @param  {string} voter
	 */
	upvote: function(post_id, voter) {
		dispatch(POST.UPVOTE, {
			post_id: (post_id == undefined) ? '' : post_id,
			voter: (voter == undefined) ? '' : voter
		});
	},

	/**
	 * downvote a post
	 * @param  {string} post_id
	 * @param  {string} voter
	 */
	downvote: function(post_id, voter) {
		dispatch(POST.DOWNVOTE, {
			post_id: (post_id == undefined) ? '' : post_id,
			voter: (voter == undefined) ? '' : voter
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
	},

	pin: function(post_id) {
		dispatch(POST.PIN, {
			post_id: (post_id == undefined) ? '' : post_id
		});
	},

	cancel: function() {
		dispatch(POST.CANCEL, {});
	}
};

module.exports = PostActions;
