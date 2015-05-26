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
var $ = require('jquery');
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

				this.posts._meta.bevy_id = BevyStore.bevies._meta.active;
				this.posts.comparator = this.sortByTop;

				this.posts.fetch({
					success: function(collection, response, options) {
						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				this.trigger(POST.CHANGE_ALL);

				break;

			case BEVY.SWITCH:
			case BEVY.JOIN:

				var bevy_id = payload.bevy_id;
				// if none, default to frontpage
				if(!bevy_id) bevy_id = -1;

				// wait for bevy switch
				Dispatcher.waitFor([BevyStore.dispatchToken]);

				this.posts._meta.bevy_id = bevy_id;

				this.posts.fetch({
					reset: true,
					success: function(collection, response, options) {
						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case POST.CREATE: // create a post

				// collect payload vars
				var title = payload.title;
				var images = payload.images;
				var author = payload.author;
				var bevy = payload.bevy;

				var newPost = this.posts.add({
					title: title,
					images: images,
					author: author._id,
					bevy: bevy._id
				});

				// switch to posting bevy realll quick
				var temp = this.posts._meta.bevy_id;
				this.posts._meta.bevy_id = bevy._id;

				// save to server
				newPost.save(null, {
					success: function(post, response, options) {
						// success
						newPost.set('_id', post.id);
						this.trigger(POST.CHANGE_ALL);

						// send notification
						$.post(
							constants.apiurl + '/notifications',
							{
								event: 'post:create',
								post: post.toJSON()
							}
						);

					}.bind(this)
				});

				// switch back
				this.posts._meta.bevy_id = temp;

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

				// set to post's bevy in case on frontpage
				var temp = this.posts._meta.bevy_id;
				this.posts._meta.bevy_id = post.get('bevy')._id;

				post.destroy({
					success: function(model, response) {
						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				// set back
				this.posts._meta.bevy_id = temp;

				break;

			case POST.UPDATE:
				var post_id = payload.post_id;
				var title = payload.postTitle;

				var post = this.posts.get(post_id);

				post.set('title', title);

				// set to post's bevy in case on frontpage
				var temp = this.posts._meta.bevy_id;
				this.posts._meta.bevy_id = post.get('bevy')._id;

				post.save({
					title: title
				}, {
					patch: true
				});

				// set back
				this.posts._meta.bevy_id = temp;

				this.trigger(POST.CHANGE_ALL);
				break;

			case POST.UPVOTE:
				var post_id = payload.post_id;
				var author = payload.author;

				this.vote(post_id, author, 1);

				this.trigger(POST.CHANGE_ALL);
				break;

			case POST.DOWNVOTE:
				var post_id = payload.post_id;
				var author = payload.author;

				this.vote(post_id, author, -1);

				this.trigger(POST.CHANGE_ALL);
				break;

			case POST.SORT:
				var by = payload.by;
				var direction = payload.direction;

				by = by.trim(); // trim whitespace - it sometimes makes it in there
				switch(by) {
					case 'new':
						this.posts.comparator = this.sortByNew;
						break;
					case 'top':
					default:
						this.posts.comparator = this.sortByTop;
						break;
				}
				this.posts.sort();

				this.trigger(POST.CHANGE_ALL);
				break;

			case POST.PIN:
				var post_id = payload.post_id;
				var post = this.posts.get(post_id);

				var pinned = post.get('pinned') || false;

				post.set('pinned', !pinned);

				// set to post's bevy in case on frontpage
				var temp = this.posts._meta.bevy_id;
				this.posts._meta.bevy_id = post.get('bevy')._id;

				post.save({
					pinned: !pinned
				}, {
					patch: true
				});

				// set back
				this.posts._meta.bevy_id = temp;

				this.trigger(POST.CHANGE_ALL);

				break;

			case POST.CANCEL:
				// TODO: remove uploaded files from the server
				this.trigger(POST.CANCELED_POST);

				break;

			case COMMENT.CREATE:
				var post_id = payload.post_id;
				var comment_id = payload.comment_id;
				var author = payload.author;
				var body = payload.body;

				var post = this.posts.get(post_id);

				$.post(
					constants.apiurl + '/comments',
					{
						postId: post_id,
						parentId: (comment_id) ? comment_id : null,
						author: author._id,
						body: body
					},
					function(data) {
						//console.log(data);
						var id = data._id;

						var comments = post.get('comments') || [];
						comments.push({
							_id: id,
							postId: post_id,
							parentId: (comment_id) ? comment_id : null,
							author: author,
							body: body,
							created: data.created
						});
						post.set('comments', comments);

						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				).fail(function(jqXHR) {
					// a server-side error has occured (500 internal error)
					// load response from jqXHR
					var response = jqXHR.responseJSON;
					console.log(response);
				}.bind(this));

				break;

			case COMMENT.DESTROY:
				var post_id = payload.post_id;
				var comment_id = payload.comment_id;

				$.ajax({
					url: constants.apiurl + '/comments/' + comment_id,
					method: 'DELETE',
					success: function(data) {
					}
				});

				var post = this.posts.get(post_id);
				var comments = post.get('comments');
				comments = _.reject(comments, function(comment) {
					return comment._id == comment_id;
				});
				post.set('comments', comments);

				this.trigger(POST.CHANGE_ALL);

				break;
		}
	},

	// send all posts to the App.jsx in JSON form
	getAll: function() {
		return (BevyStore.bevies._meta.active)
		? this.posts.toJSON()
		: [];
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

		var MAX_VOTES = 5;

		var post = this.posts.get(post_id);

		var votes = post.get('votes');

		if(_.isEmpty(votes)) {
			// create new voter
			votes.push({
				voter: author._id,
				score: value
			});
		} else {
			var vote = _.findWhere(votes, { voter: author._id });
			if(vote == undefined) {
				// voter not found, create new voter
				votes.push({
					voter: author._id,
					score: value
				});
			} else {
				// check if they've exceeded their max votes
				if(Math.abs(vote.score + value) > MAX_VOTES)
					return;

				// add score to existing voter
				vote.score += value;
			}
		}

		post.set('votes', votes);

		// set the url in case on frontpage
		var temp = this.posts._meta.bevy_id;
		this.posts._meta.bevy_id = post.get('bevy')._id;

		// save to server
		post.save({
			votes: votes
		}, {
			patch: true
		});

		// set back
		this.posts._meta.bevy_id = temp;

		// sort posts
		this.posts.sort();
	},

	sortByTop: function(post) {
		var score = post.countVotes();
		if(post.get('pinned')) score = 9000;
		return -score;
	},

	sortByNew: function(post) {
		var date = Date.parse(post.get('created'));
		if(post.get('pinned')) date = 0;
		return -date;
	}
});

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;






