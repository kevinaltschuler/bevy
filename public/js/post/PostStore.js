/**
 * PostStore.js
 * where Backbone, Flux, and React all sit down to talk
 * --------
 * Backbone - creates post model and posts collection
 * Flux - registers the handleDispatch function and handles events
 * React - emits 'change' events to force update the container component
 * --------
 * @author albert
 */

'use strict';

// TODO: grab according to specified bevy

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var POST = require('./../constants').POST;
var BEVY = require('./../constants').BEVY;
var Dispatcher = require('./../shared/dispatcher');

var Post = require('./PostModel');
var PostCollection = require('./PostCollection');

// create collection
var posts = new PostCollection;

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var PostStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(PostStore, {

	initialize: function() {
		// register dispatcher
		var dispatchId = Dispatcher.register(this.handleDispatch.bind(this));
	},

	// handle calls from the dispatcher
	// these are created from PostActions.js
	handleDispatch: function(payload) {
		// helper vars
		var
		  title
		, body
		, image_url
		, author
		, bevy;

		switch(payload.actionType) {

			case POST.CREATE: // create a post

				// collect payload vars
				title = payload.title;
				body = payload.body;
				image_url = payload.image_url;
				author = payload.author;
				bevy = payload.bevy;

				// create model and save
				create({
					  title: title
					, body: body
					, image_url: image_url
					, author: author
					, bevy: bevy
				});

				// this requires a visual update
				this.trigger(POST.CHANGE_ALL);
				break;

			case POST.UPVOTE:
				//console.log('upvote');
				var post_id = payload.post_id;
				var author = payload.author;

				vote(post_id, author, 1);

				this.trigger(POST.CHANGE_ONE);
				break;

			case POST.DOWNVOTE:
				//console.log('downvote');
				var post_id = payload.post_id;
				var author = payload.author;

				vote(post_id, author, -1);

				this.trigger(POST.CHANGE_ONE);
				break;

			case POST.SORT:
				//console.log('sort', payload.by, payload.direction);
				var by = payload.by;
				var direction = payload.direction;

				switch(by) {
					case 'new':
						posts.comparator = sortByNew;
						break;
					case 'top':
						posts.comparator = sortByTop;
						break;
				}
				posts.sort();
				//console.log(posts.pluck('title'));

				this.trigger(POST.CHANGE_ALL);
				break;

			case BEVY.SWITCH:
				var id = payload.id;
				posts._meta.bevyid = id;

				posts.fetch({
					success: function(collection, response, options) {
						// for some reason this.trigger(POST.CHANGE_ALL)
						// doesn't work at all
						PostStore.trigger(POST.CHANGE_ALL);
					}
				});
				break;
		}
	},

	// send all posts to the App.jsx in JSON form
	getAll: function() {
		// TODO: plug sorting (new/top) into here?
		return posts.toJSON();
	},

	/**
	 * get post by id
	 * @param  {number} post id
	 * @return {[type]}
	 */
	getPost: function(id) {
		return posts.get(id).toJSON();
	},

	/**
	 * get how the post list is currently sorted
	 * @return {[type]}
	 */
	getSort: function() {
		return {
			  by: posts._meta.sort.by
			, direction: posts._meta.sort.direction
		};
	}
});
module.exports = PostStore;

// create a post
// and save to db (not implemented yet)
function create(options) {
	var newPost = new Post({
		  title: options.title
		, body: options.body
		, image_url: options.image_url
		, author: options.author
		, bevy: options.bevy
		, points: []
		, comments: []
	});

	// PUT to db
	//newPost.save();
	// generate fake ID for now
	newPost.set('id', Date.now());

	// add to collection
	posts.add(newPost);
}

function vote(post_id, author, value) {
	var voted_post = posts.get(post_id);

	if(!voted_post) {
		// post not found
		// TODO: return a snackbar message or something
		return;
	}

	// create a shallow copy so we don't descend
	// into reference hell
	var points = voted_post.get('points').slice();

	// check for already voted
	var maxVotes = 3;
	var votes = value; //take into account the current vote
	points.forEach(function(vote) {
		if(vote.author === author) votes += vote.value;
	});
	if(votes > maxVotes || votes < (0 - maxVotes)) {
		// over the limit son
		return;
	}

	points.push({ author: author, value: value });
	voted_post.set('points', points);

	// TODO: save post
}

function sortByTop(post) {
	return -post.countVotes();
};

function sortByNew(post) {
	return -Date.parse(post.get('created'));
}
