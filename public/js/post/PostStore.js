/**
 * PostStore.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var router = require('./../router');

var constants = require('./../constants');
var POST = constants.POST;
var BEVY = constants.BEVY;
var APP = constants.APP;
var COMMENT = constants.COMMENT;
var BOARD = constants.BOARD;

var BevyStore = require('./../bevy/BevyStore');

var Dispatcher = require('./../shared/dispatcher');

var PostCollection = require('./PostCollection');
var Comment = require('./CommentModel');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var PostStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(PostStore, {

  posts: new PostCollection,
  sortType: 'new',
  dateRange: 'all',
  activeBevy: router.bevy_id,
  activeBoard: router.board_id,
  searchPosts: new PostCollection,
  searchQuery: '',

  // handle calls from the dispatcher
  // these are created from PostActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        break;

      case POST.FETCH_SINGLE:
        var post_id = payload.post_id;
        fetch(constants.apiurl + '/posts/' + post_id, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
          this.posts.reset([res]);
          this.posts.nestComments();
          this.trigger(POST.CHANGE_ALL);
        })
        .catch(err => {
        });
        break;

      case BOARD.SWITCH:
        var board_id = payload.board_id;
        var router = require('./../router');
        var url;
        if(board_id) {
          url = constants.apiurl + '/boards/' + board_id + '/posts';
        } else {
          url = constants.apiurl + '/bevies/' + router.bevy_slug + '/posts';
        }
        url = this.addSortType(url);
        url = this.addDateRange(url);
        this.posts.url = url;
        this.posts.fetch({
          success: function(collection, response, options) {
            this.posts.nestComments();

            if(board_id)
              this.activeBoard = board_id;

            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case POST.FETCH:
        var board_id = payload.board_id;
        var url = constants.apiurl + '/boards/' + board_id + '/posts';
        url = this.addSortType(url);
        url = this.addDateRange(url);
        this.posts.url = url;
        this.posts.fetch({
          success: function(collection, response, options) {
            this.posts.nestComments();

            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case POST.SEARCH:
        var query = payload.query;
        var bevy_id = payload.bevy_id;
        var board_id = payload.board_id;

        // set the search query before POST.SEARCHING is triggered
        // so the front-end can catch it
        this.searchQuery = query;

        // uri encode the search query to make it URL friendly
        query = (query) ? encodeURIComponent(query) : '';

        // trigger the searching event
        this.trigger(POST.SEARCHING);

        // construct the search query
        var url = constants.apiurl + '/posts/search/' + query;
        if(bevy_id)
          url += '?bevy_id=' + bevy_id;
        else if(board_id)
          url += '?board_id=' + board_id;

        url = this.addSortType(url);
        url = this.addDateRange(url);

        this.searchPosts.url = url;

        // send the request to the server
        this.searchPosts.fetch({
          reset: true,
          success: function(collection, response, options) {
            // got the posts successfully
            this.posts.nestComments();
            this.trigger(POST.SEARCH_COMPLETE);
          }.bind(this),
          error: function(error) {
            // something went wrong
            this.trigger(POST.SEARCH_ERROR, error.toString());
          }.bind(this)
        });
        break;

      case POST.CREATE:
        var $BevyStore = require('./../bevy/BevyStore');
        var title = payload.title;
        var images = payload.images;
        var author = window.bootstrap.user;
        var board = payload.board;
        var bevy = $BevyStore.getActive();
        var event = payload.event;
        var type = payload.type;

        var posts_expire_in;
        if(board.settings.posts_expire_in && board.settings.posts_expire_in > 0) {
          posts_expire_in = board.settings.posts_expire_in // in days
          posts_expire_in *= (1000 * 60 * 60 * 24); // convert to seconds
          posts_expire_in += Date.now(); // add now
        } else {
          // by default, dont expire
          posts_expire_in = new Date('2035', '1', '1');
        }

        var newPost = this.posts.unshift({
          title: title,
          comments: [],
          images: images,
          author: author._id,
          bevy: bevy._id,
          board: board._id,
          event: event,
          type: type,
          created: Date.now(),
          expires: posts_expire_in,
        });

        newPost.url = constants.apiurl + '/posts';

        // save to server
        newPost.save(null, {
          success: function(post, response, options) {
            // success
            newPost.set('_id', post.id);
            newPost.set('images', post.get('images'));
            newPost.set('links', post.get('links'));
            newPost.set('author', author);
            newPost.set('board', board);
            newPost.set('bevy', bevy);
            newPost.set('type', type);
            newPost.set('event', event);
            newPost.set('commentCount', 0);

            setTimeout(() => {
              this.trigger(POST.POSTED_POST);
              this.trigger(POST.CHANGE_ALL);
            }, 1000);
          }.bind(this)
        });

        break;

      case POST.DESTROY:
        var post_id = payload.post_id;
        var post = this.posts.remove(post_id);
        if(post == undefined) break;
        post.url = constants.apiurl + '/posts/' + post_id;
        post.destroy();
        this.trigger(POST.CHANGE_ALL);
        break;

      case POST.UPDATE:
        var post_id = payload.post_id;
        var post = this.posts.get(post_id);
        if(post == undefined) break;

        var title = payload.title || post.get('title');
        var images = payload.images || post.get('images');
        var event = payload.event || post.get('event');

        post.url = constants.apiurl + '/posts/' + post_id;
        post.save({
          title: title,
          images: images,
          event: event,
          updated: Date.now()
        }, {
          patch: true
        });

        this.trigger(POST.CHANGE_ONE + post_id);
        break;

      case POST.VOTE:
        var post_id = payload.post_id;
        var voter = payload.voter;

        var post = this.posts.get(post_id);
        if(post == undefined) break;

        //this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';

        var votes = post.get('votes');
        var vote = _.findWhere(votes, { voter: voter._id });
        if(vote == undefined) {
          // voter not found, create new voter
          votes.push({
            voter: voter._id,
            score: 1
          });
        } else {
          votes = _.map(votes, function($vote) {
            if($vote.voter == voter._id) {
              // found the voter
              $vote.score = ($vote.score > 0) ? 0 : 1;
            }
            return $vote;
          });
        }
        post.url = constants.apiurl + '/posts/' + post.get('_id');
        post.save({
          votes: votes
        }, {
          patch: true,
          success: function(post, response, options) {
          }.bind(this)
        });
        // instant update
        post.set('votes', votes);
        // sort posts
        this.trigger(POST.CHANGE_ONE + post.id);
        break;

      case POST.SORT:
        let type = payload.type;
        let date = payload.date;
        // see if we need to modify the posts or search posts collection
        let searching = this.searchQuery.length >= 1;

        if(this.sortType == type && this.dateRange == date) {
          // we just sorted for this. dont send a redundant request
          break;
        }

        // set the sort type and date range flags of the store
        this.sortType = type;
        this.dateRange = date;

        // determine which post collection to sort
        var collection = (searching)
          ? this.searchPosts : this.posts;

        // get the original url before the old query string
        var url = collection.url.split('?')[0];
        // and append the sort query params
        url = this.addSortType(url);
        url = this.addDateRange(url);

        // reset the backbone collection url
        collection.url = url;
        // and then fetch from the server
        collection.fetch({
          reset: true,
          success: function(collection, response, options) {
            // nest comments for all posts
            collection.nestComments();
            // see what we need to trigger for the front-end to update
            if(searching) this.trigger(POST.SEARCH_COMPLETE);
            else this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case POST.PIN:
        var post_id = payload.post_id;
        var post = this.posts.get(post_id);

        var pinned = !post.get('pinned');

        var expires = (pinned)
        ? new Date('2035', '1', '1') // expires in a long time
        : new Date(Date.now() + (post.get('board').settings.posts_expire_in * 1000 * 60 * 60 * 24)) // unpinned - expire like default

        if(!pinned && (post.get('board').settings.posts_expire_in == -1)) expires = new Date('2035', '1', '1');

        post.set('pinned', pinned);
        post.set('expires', expires);

        post.save({
          pinned: pinned,
          expires: expires
        }, {
          patch: true
        });

        this.trigger(POST.CHANGE_ALL);
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

        var newComment = new Comment({
          postId: post_id,
          parentId: (comment_id) ? comment_id : null,
          author: author._id,
          body: body
        });

        newComment.url = constants.apiurl + '/comments';

        newComment.save(null, {
          success: function(model, response, options) {
            var comments = post.get('comments') || [];
            var comment = (comment_id)
              ? _.findWhere(comments, { _id: comment_id })
              : {};
            var new_comment = {
              _id: model.get('_id'),
              postId: post_id,
              parentId: (comment_id) ? comment_id : undefined,
              author: author,
              body: body,
              comments: [],
              created: model.get('created')
            };
            comments.push(new_comment);
            post.set('comments', comments);
            post.updateComments();

            this.trigger(POST.CHANGE_ONE + post_id);
          }.bind(this)
        });

        break;

      case COMMENT.DESTROY:
        var post_id = payload.post_id;
        var comment_id = payload.comment_id;

        fetch(constants.apiurl + '/comments/' + comment_id, {
          method: 'DELETE'
        });

        var post = this.posts.get(post_id);
        if(post == undefined) return;

        var comments = post.get('comments');
        comments = _.reject(comments, function(comment) {
          return comment._id == comment_id;
        });
        post.set('comments', comments);
        post.updateComments();

        // trigger changes
        this.trigger(POST.CHANGE_ONE + post_id);
        break;
    }
  },

  // add post - used for livereloading
  addPost(post) {
    var router = require('./../router');
    var BevyStore = require('./../bevy/BevyStore');
    // are we in the bevy view and does this post belong to that bevy?
    if(router.current == 'bevy' && !_.isEmpty(BevyStore.getActiveBevy())) {
      var activeBevy = BevyStore.getActiveBevy();
      if(_.contains(activeBevy.boards, post.board._id)) {
        this.posts.add(post);
        this.trigger(POST.CHANGE_ALL);
      } else {
        // this post doesn't belong in the active bevy. get outta here
        return;
      }
    }
    // are we in the board view and does this post belong to that board?
    else if(router.current == 'board' && post.board._id == router.board_id) {
      this.posts.add(post);
      this.trigger(POST.CHANGE_ALL);
    }
    // the post we received doesn't need to get livereloaded. return
    else return;
  },

  // add comment - used for livereloading
  addComment(comment) {
    var post_id = comment.postId._id;
    var post = this.posts.get(post_id);
    if(post == undefined) return;

    var comments = post.get('allComments');

    // check to see if comment already exists
    if(_.findWhere(comments, { _id: comment._id }) != undefined) {
      // if so, then break out of this
      return;
    }

    comments.push(comment);
    post.set('comments', comments);
    post.nestComments();

    this.trigger(POST.CHANGE_ONE + post_id);
  },

  addDateRange(url) {
    let startDate, endDate;
    switch(this.dateRange) {
      case 'day':
        // from 1 day ago
        startDate = (new Date(Date.now() - (1000 * 60 * 60 * 24))).toString();
        // until now
        endDate = (new Date).toString();
        break;
      case 'week':
        // from 1 week ago
        startDate = (new Date(Date.now() - (1000 * 60 * 60 * 24 * 7))).toString();
        // until now
        endDate = (new Date).toString();
        break;
      case 'month':
        // from 1 month ago
        // assume a month is 30 days
        startDate = (new Date(Date.now() - (1000 * 60 * 60 * 24 * 30))).toString();
        // until now
        endDate = (new Date).toString();
        break;
      case 'all':
        // only specify an end date
        endDate = (new Date).toString();
        break;
      default:
        break;
    }
    if(startDate) {
      var separator = (url.split('?').length >= 2) ? '&' : '?';
      url += separator + 'start_date=' + encodeURIComponent(startDate);
    }
    if(endDate) {
      var separator = (url.split('?').length >= 2) ? '&' : '?';
      url += separator + 'end_date=' + encodeURIComponent(endDate);
    }
    return url;
  },
  addSortType(url) {
    var separator = (url.split('?').length >= 2) ? '&' : '?';
    return url + separator + 'sort=' + this.sortType;
  },

  // send all posts to the App.jsx in JSON form
  getAll() {
    return this.posts.toJSON();
  },

  getPost(id) {
    var post = this.posts.get(id);
    return (post == undefined)
      ? null
      : post.toJSON();
  },

  getSort() {
    return this.sortType;
  },

  getSearchPosts() {
    return this.searchPosts.toJSON();
  }
});

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;
