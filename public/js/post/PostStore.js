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

var Dispatcher = require('./../shared/dispatcher');


// post backbone model
// corresponds (hopefully) with the mongoose model
// in models/Post.js
var Post = Backbone.Model.extend({
	defaults: {
		  id: null
		, title: null
		, body: null
		, image_url: null
		, author: null
		, bevy: null
		, comments: []
		, points: []
		, created: new Date()
		, updated: new Date()
	},

	// where to send the CRUD calls (create, read, update, delete)
	url: function() {
		return (this.id) ? '/posts/' + this.id : '/posts/';
	}
});

// post backbone collection
// really just a fancy array with some CRUD functions
var Posts = Backbone.Collection.extend({
	  model: Post
	, url: '/posts'
});
// create collection
var posts = new Posts;

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

			case 'create': // create a post

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
				this.trigger('change');
				break;

			case 'upvote':
				console.log('upvote');
				var post_id = payload.post_id;
				var author = payload.author;

				vote(post_id, author, 1);

				this.trigger('change');

				break;
			case 'downvote':
				console.log('downvote');
				var post_id = payload.post_id;
				var author = payload.author;

				vote(post_id, author, -1);

				this.trigger('change');

				break;
		}
	},

	// send all posts to the App.jsx in JSON form
	getAll: function() {
		// TODO: plug sorting (new/top) into here?
		return posts.toJSON();
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
	// TODO: sort collection here
	posts.add(newPost, {
		at: 0
	});
}

function vote(post_id, author, value) {
	var post = posts.get(post_id);

	if(!post) {
		// post not found
		// TODO: return a snackbar message or something
		return;
	}

	var points = post.get('points');

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
	post.set('points', points);
}
