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

var constants = require('./../constants');
var POST = constants.POST;
var ALIAS = constants.ALIAS;
var BEVY = constants.BEVY;
var APP = constants.APP;
var COMMENT = constants.COMMENT;

var BevyStore = require('./../bevy/BevyStore');

var Dispatcher = require('./../shared/dispatcher');

var PostCollection = require('./PostCollection');
var CommentCollection = require('./CommentCollection');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var PostStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(PostStore, {

	posts: new PostCollection,

	// handle calls from the dispatcher
	// these are created from PostActions.js
	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case APP.LOAD:

				// wait for bevies
				Dispatcher.waitFor([BevyStore.dispatchToken]);

				var bevy = BevyStore.getActive();
				this.posts._meta.bevy = bevy;
				this.posts.comparator = this.sortByTop;

				this.posts.fetch({
					success: function(collection, response, options) {

						// set comment collection from the passed in array
						collection.forEach(function(post) {
							var comments = new CommentCollection(post.get('comments'));
							// set url
							comments.url = constants.apiurl + '/bevies/' + bevy.id + '/posts/' + post.id + '/comments';
							post.set('comments', comments);
						});

						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				this.trigger(POST.CHANGE_ALL);

				break;

			case BEVY.SWITCH:

				// wait for bevy switch
				Dispatcher.waitFor([BevyStore.dispatchToken]);

				var bevy = BevyStore.getActive();
				this.posts._meta.bevy = bevy;

				this.posts.fetch({
					reset: true,
					success: function(collection, response, options) {
						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				this.trigger(POST.CHANGE_ALL);

				break;

			case POST.CREATE: // create a post

				// collect payload vars
				var title = payload.title;
				var body = payload.body;
				var image_url = payload.image_url;
				var author = payload.author;
				var bevy = payload.bevy;

				var newPost = this.posts.add({
					title: title,
					body: body,
					image_url: image_url,
					author: author._id,
					bevy: bevy._id
				});

				// save to server
				newPost.save({
					success: function() {
						// success
					}
				});

				// simulate server population
				newPost.set('_id', String(Date.now()));
				newPost.set('author', author);
				newPost.set('bevy', bevy);

				// this requires a visual update
				this.trigger(POST.CHANGE_ALL);

				break;

			case POST.DESTROY:
				var post_id = payload.post_id;
				var post = this.posts.get(post_id);

				post.destroy({
					success: function(model, response) {
						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case POST.UPVOTE:
				var post_id = payload.post_id;
				var author = payload.author;

				this.vote(post_id, author, 1);

				this.trigger(POST.CHANGE_ONE);
				break;

			case POST.DOWNVOTE:
				var post_id = payload.post_id;
				var author = payload.author;

				this.vote(post_id, author, -1);

				this.trigger(POST.CHANGE_ONE);
				break;

			case POST.SORT:
				var by = payload.by;
				var direction = payload.direction;

				switch(by) {
					case 'new':
						this.posts.comparator = sortByNew;
						break;
					case 'top':
						this.posts.comparator = sortByTop;
						break;
				}
				this.posts.sort();

				this.trigger(POST.CHANGE_ALL);
				break;

			case COMMENT.CREATE:
				var post_id = payload.post_id;
				var author = payload.author;
				var body = payload.body;

				var post = this.posts.get(post_id);
				var comments = post.get('comments');

				var comment = comments.add({
					author: author._id,
					body: body
				});

				// save comment to server
				// API will add comment to post's comment array
				comment.save();

				// simulate population
				comment.set('_id', String(Date.now()));
				comment.set('author', author);


				//console.log(comments.toJSON());
				//console.log(this.getAll());

				this.trigger(POST.CHANGE_ALL);
				break;
		}
	},

	// send all posts to the App.jsx in JSON form
	getAll: function() {
		//return JSON.parse(JSON.stringify(this.posts.attributes));
		//var posts = [];
		//this.posts.forEach(function(post) {
			//console.log(post, post.toJSON());
			//posts.push(post.toJSON());
		//});
		//console.log(posts);
		//return posts;
		return this.posts.toJSON();
	},

	/**
	 * get post by id
	 * @param  {number} post id
	 * @return {[type]}
	 */
	getPost: function(id) {
		return this.posts.get(id).toJSON();
	},

	/**
	 * get how the post list is currently sorted
	 * @return {[type]}
	 */
	getSort: function() {
		return {
			by: this.posts._meta.sort.by,
			direction: this.posts._meta.sort.direction
		};
	},

	vote: function(post_id, author, value) {
		var voted_post = this.posts.get(post_id);

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

		// TODO: save post
		voted_post.save({
			points: points
		}, {
			patch: true
		});
	},

	sortByTop: function(post) {
		return -post.countVotes();
	},

	sortByNew: function(post) {
		return -Date.parse(post.get('created'));
	}
});

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;






