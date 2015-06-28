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

var router = require('./../router');

var constants = require('./../constants');
var POST = constants.POST;
var ALIAS = constants.ALIAS;
var BEVY = constants.BEVY;
var APP = constants.APP;
var COMMENT = constants.COMMENT;

var BevyStore = require('./../bevy/BevyStore');

var Dispatcher = require('./../shared/dispatcher');

var PostCollection = require('./PostCollection');

//var tagRegex = new RegExp('#\w+', 'g');
var tagRegex = /#\w+/g;

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var PostStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(PostStore, {

	posts: new PostCollection,

	activeBevy: router.bevy_id,

	// handle calls from the dispatcher
	// these are created from PostActions.js
	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case APP.LOAD:

				// wait for bevies
				Dispatcher.waitFor([BevyStore.dispatchToken]);

				break;

			case BEVY.SWITCH:

				// wait for bevy switch
				Dispatcher.waitFor([BevyStore.dispatchToken]);

				// dont load posts in a public bevy
				// also reset the posts
				var bevy_id = payload.bevy_id;
				if(_.isEmpty(BevyStore.bevies.get(bevy_id))) {
					this.posts.reset();
					break;
				}

				if(bevy_id == this.activeBevy) break;

				this.posts.fetch({
					reset: true,
					success: function(posts, response, options) {

						posts.forEach(function(post) {
							this.postsNestComment(post);
						}.bind(this));

						this.activeBevy = bevy_id;

						this.posts.sort();

						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case POST.FETCH:
				var bevy_id = payload.bevy_id;
				//var bevy = this.bevies.get(bevy_id);

				if(bevy_id == this.activeBevy && bevy_id != -1) {
					// load the new post
					this.posts.fetch({
						success: function(posts, response, options) {

							posts.forEach(function(post) {
								this.postsNestComment(post);
							}.bind(this));

							this.posts.sort();

							this.trigger(POST.CHANGE_ALL);
						}.bind(this)
					});
				}

				break;

			case POST.CREATE: // create a post

				// collect payload vars
				var title = payload.title;
				var images = payload.images;
				var author = payload.author;
				var bevy = payload.bevy;
				var active_member = payload.active_member;

				var posts_expire_in = bevy.settings.posts_expire_in || 7;
				posts_expire_in *= (1000 * 60 * 60 * 24);
				posts_expire_in += Date.now();

				var tags = title.match(tagRegex);
				tags = _.map(tags, function(tag) {
					return tag.slice(1, tag.length); // remove the hashtag
				});

				var newPost = {
					title: title,
					tags: tags,
					comments: [],
					images: images,
					author: author._id,
					bevy: bevy._id,
					created: Date.now(),
					expires: posts_expire_in
				};
				var newPost = this.posts.add(newPost);
				var tempBevy = newPost.get('bevy');
				newPost.set('bevy', bevy._id);

				// save to server
				newPost.save(null, {
					success: function(post, response, options) {
						// success
						newPost.set('_id', post.id);
						newPost.set('images', post.get('images'));
						newPost.set('links', post.get('links'));
						newPost.set('author', author);
						newPost.set('bevy', tempBevy);
						newPost.set('commentCount', 0);

						this.posts.sort();

						this.trigger(POST.CHANGE_ALL);
						this.trigger(POST.POSTED_POST);
					}.bind(this)
				});

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
				var tags = title.match(tagRegex);

				var tags = title.match(tagRegex);
				tags = _.map(tags, function(tag) {
					return tag.slice(1, tag.length); // remove the hashtag
				});

				var post = this.posts.get(post_id);

				post.set('title', title);
				post.set('tags', tags);

				post.save({
					title: title,
					tags: tags,
					updated: Date.now()
				}, {
					patch: true,
					success: function($post, response, options) {

						post.set('images', $post.get('images'));
						post.set('links', $post.get('links'));

						this.trigger(POST.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case POST.UPVOTE:
				var post_id = payload.post_id;
				var voter = payload.voter;

				this.vote(post_id, voter, 1);

				this.trigger(POST.CHANGE_ONE + post_id);
				break;

			case POST.DOWNVOTE:
				var post_id = payload.post_id;
				var voter = payload.voter;

				this.vote(post_id, voter, -1);

				this.trigger(POST.CHANGE_ONE + post_id);
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

			case POST.MUTE:
				var post_id = payload.post_id;
				var post = this.posts.get(post_id);

				var user = window.bootstrap.user;

				var muted_by = post.get('muted_by') || [];
				// unmute post if user is found
				muted_by = _.reject(muted_by, function(muter) {
					return muter == user._id;
				});
				// else, add user to muted by
				if(muted_by.length == (post.get('muted_by') || []).length)
					muted_by.push(user._id);

				post.save({
					muted_by: muted_by
				}, {
					patch: true
				});

				this.trigger(POST.CHANGE_ALL);

				break;

			case POST.PIN:
				var post_id = payload.post_id;
				var post = this.posts.get(post_id);

				var pinned = !post.get('pinned');

				var expires = (pinned)
				? new Date('2035', '1', '1') // expires in a long time
				: new Date(Date.now() + (1000 * 60 * 30)) // unpinned - expire in 30 minutes

				post.set('pinned', pinned);
				post.set('expires', expires);

				post.save({
					pinned: pinned,
					expires: expires
				}, {
					patch: true
				});

				this.posts.sort();

				this.trigger(POST.CHANGE_ONE + post_id);
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
						// optimistic update
						var id = data._id;

						if(comment_id) {
							// replied to a comment
							var comments = post.get('allComments');
							var comment = _.findWhere(comments, { _id: comment_id });
							var new_comment = {
								_id: id,
								depth: comment.depth+1,
								postId: post_id,
								parentId: comment_id,
								author: author,
								body: body,
								comments: [],
								created: data.created
							};

							if(!comment.comments) comment.comments = [];
							comment.comments.push(new_comment);
							comments.push(new_comment);
							//this.postsNestComment(post);

							// increment comment count
							var commentCount = post.get('commentCount');
							post.set('commentCount', ++commentCount);

						} else {
							// replied to a post

							var comments = post.get('comments') || [];
							var allComments = post.get('allComments') || [];
							var new_comment = {
								_id: id,
								postId: post_id,
								parentId: undefined,
								author: author,
								body: body,
								created: data.created
							};
							comments.push(new_comment);
							allComments.push(new_comment);
							//this.postsNestComment(post);
						}

						var stripped_members = _.map(post.get('bevy').members, function(member) {
							var new_member = {};
							new_member.role = member.role;
							new_member.notificationLevel = member.notificationLevel;
							if(_.isObject(member.user))
								new_member.user = member.user._id;
							else new_member.user = member.user;
							return new_member;
						});

						// send notification
						$.post(
							constants.apiurl + '/notifications',
							{
								event: 'comment:create',
								author_id: author._id,
								author_name: author.displayName,
								author_image: author.image_url,
								post_id: post.get('_id'),
								post_title: post.get('title'),
								post_author_id: post.get('author')._id,
								post_muted_by: post.get('muted_by') || [],
								bevy_name: post.get('bevy').name,
								bevy_members: stripped_members
							}
						);

						//this.trigger(POST.CHANGE_ALL);
						this.trigger(POST.CHANGE_ONE + post_id);
					}.bind(this)
				);

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

				if(_.findWhere(comments, { _id: comment_id })) {
					// delete from post
					comments = _.reject(comments, function(comment) {
						return comment._id == comment_id;
					});
					post.set('comments', comments);
				} else {
					// delete from comment
					this.removeComment(comments, comment_id);
				}

				var commentCount = post.get('commentCount');
				post.set('commentCount', --commentCount);
				//this.postsNestComment(post);

				//this.trigger(POST.CHANGE_ALL);
				this.trigger(POST.CHANGE_ONE + post_id);

				break;
		}
	},

	// send all posts to the App.jsx in JSON form
	getAll: function() {
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

	vote: function(post_id, voter, value) {
		var MAX_VOTES = 5;
		var post = this.posts.get(post_id);
		var votes = post.get('votes');

		if(_.isEmpty(votes)) {
			// create new voter
			votes.push({
				voter: voter._id,
				score: value
			});
		} else {
			var vote = _.findWhere(votes, { voter: voter._id });
			if(vote == undefined) {
				// voter not found, create new voter
				votes.push({
					voter: voter._id,
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
		// save to server
		post.save({
			votes: votes
		}, {
			patch: true
		});
		// sort posts
		this.posts.sort();
	},

	sortByTop: function(post) {
		var score = post.countVotes();
		if(post.get('pinned') && router.bevy_id != -1) score = 9000;
		return -score;
	},

	sortByNew: function(post) {
		var date = Date.parse(post.get('created'));
		if(post.get('pinned') && router.bevy_id != -1) date = new Date('2035', '1', '1');
		return -date;
	},

	/**
	 * recursively remove a comment
	 */
	removeComment: function(comments, comment_id) {
		// use every so we can break out if we need
		return comments.every(function(comment, index) {
			if(comment._id == comment_id) {
				// it's a match. remove the comment and collapse
				comments.splice(index, 1);
				return false;
			}
			if(_.isEmpty(comment.comments)) {
				// end of the line. collapse
				return false;
			}
			else {
				// there's more. keep going
				return this.removeComment(comment.comments, comment_id);
			}
			// continue the every loop
			return true;
		}.bind(this));
	},

	postsNestComment: function(post) {
		var comments = post.get('comments');
		// create deep clone to avoid reference hell
		comments = _.map(comments, function(comment) {
			return comment;
		});

		post.set('allComments', comments);
		post.set('commentCount', comments.length);

		// recurse through comments
		post.set('comments', this.nestComments(comments));
	},

	nestComments: function(comments, parentId, depth) {
		// increment depth (used for indenting later)
		if(typeof depth === 'number') depth++;
		else depth = 1;

		if(comments.length < 0) return []; // return if it's the end of the line

		var $comments = [];
		comments.forEach(function(comment, index) {
			// look for comments under this one
			if(comment.parentId == parentId) {
				comment.depth = depth;
				// and keep going
				comment.comments = this.nestComments(comments, comment._id, depth);
				$comments.push(comment);
				// TODO: splice the matched comment out of the list so we can go faster
			}
		}.bind(this));

		return $comments;
	}
});

PostStore.posts.comparator = PostStore.sortByTop;

var posts = window.bootstrap.posts;
PostStore.posts.reset(posts);
PostStore.posts.forEach(function(post) {
	PostStore.postsNestComment(post);
});

//PostStore.trigger(POST.CHANGE_ALL);

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;






