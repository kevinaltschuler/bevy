/**
 * PostStore.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

// imports
var Backbone = require('backbone');
var $ = require('jquery');
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
  activeBevy: router.bevy_id,
  activeBoard: router.board_id,

  // handle calls from the dispatcher
  // these are created from PostActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;
        this.posts.comparator = PostStore.sortByNew;
        this.posts.url = constants.apiurl + '/bevies/' + bevy_id + '/posts';
        this.posts.fetch({
          success: function(collection, response, options) {
            this.posts.forEach(function(post) {
              post.nestComments();
            }.bind(this));

            this.activeBevy = bevy_id;
            this.posts.sort();
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BOARD.SWITCH:
        var board_id = payload.board_id;
        this.posts.comparator = PostStore.sortByNew;
        this.posts.url = constants.apiurl + '/boards/' + board_id + '/posts';
        this.posts.fetch({
          success: function(collection, response, options) {
            this.posts.forEach(function(post) {
              post.nestComments();
            }.bind(this));

            this.activeBoard = board_id;
            this.posts.sort();
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case POST.FETCH:
        var board_id = payload.board_id;
        this.posts.url = constants.apiurl + '/boards/' + board_id + '/posts';
        this.posts.url += ('?skip=' + this.posts.length);
        this.posts.fetch({
          success: function(collection, response, options) {
            this.posts.forEach(function(post) {
              post.nestComments();
            }.bind(this));

            this.posts.sort();
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case POST.CREATE: // create a post

        // collect payload vars
        var title = payload.title;
        var images = payload.images;
        var author = payload.author;
        var board = payload.board;
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

        var newPost = this.posts.add({
          title: title,
          comments: [],
          images: images,
          author: author._id,
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
            newPost.set('type', type);
            newPost.set('event', event);
            newPost.set('commentCount', 0);

            this.posts.sort();

            this.trigger(POST.POSTED_POST);
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

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

      case POST.UPDATE:
        var post_id = payload.post_id;
        var title = payload.postTitle;
        var images = payload.images;

        var post = this.posts.get(post_id);

        post.set('title', title);
        post.set('images', images);

        post.save({
          title: title,
          images: images,
          updated: Date.now()
        }, {
          patch: true,
          success: function($post, response, options) {
            post.set('images', $post.get('images'));
            this.trigger(POST.CHANGE_ALL);
          }.bind(this)
        });

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
        //this.posts.sort();
        this.trigger(POST.CHANGE_ONE + post.id);
        //this.trigger(POST.CHANGE_ALL);

        break;

      case POST.SORT:
        var by = payload.by;
        var direction = payload.direction;

        by = by.trim(); // trim whitespace - it sometimes makes it in there
        switch(by) {
          case 'new':
            default:
            this.sortType = 'new';
            this.posts.comparator = this.sortByNew;
            break;
          case 'top':
            this.sortType = 'top';
            this.posts.comparator = this.sortByTop;
            break;
          /*case 'events':
            this.sortType = 'events';
            this.posts.comparator = this.sortByEvents;
            break;*/
        }
        this.posts.sort();

        this.trigger(POST.CHANGE_ALL);
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

        this.posts.sort();
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
            var comments = post.get('allComments') || [];
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
            post.nestComments();

            // increment comment count
            var commentCount = post.get('commentCount') || 0;
            post.set('commentCount', ++commentCount);

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

        // remove comment and re-nest them
        var comments = post.get('allComments');
        comments = _.reject(comments, function(comment) {
          return comment._id == comment_id;
        });
        post.set('comments', comments);
        post.nestComments()

        // update comment count;
        var commentCount = post.get('commentCount');
        post.set('commentCount', --commentCount);

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
    var commentCount = post.get('commentCount');

    // check to see if comment already exists
    if(_.findWhere(comments, { _id: comment._id }) != undefined) {
      // if so, then break out of this
      return;
    }

    comments.push(comment);
    post.set('comments', comments);
    post.nestComments();

    commentCount++;
    post.set('commentCount', commentCount);

    this.trigger(POST.CHANGE_ONE + post_id);
  },

  // send all posts to the App.jsx in JSON form
  getAll() {
    return this.posts.toJSON();
  },

  /**
   * get post by id
   * @param  {number} post id
   * @return {[type]}
   */
  getPost(id) {
    return this.posts.get(id).toJSON();
  },

  /**
   * get how the post list is currently sorted
   * @return {[type]}
   */
  getSort() {
    return this.sortType;
  },

  sortByTop(post) {
    var score = post.countVotes();
    if(post.get('pinned')) score = 9000;
    return -score;
  },

  sortByNew(post) {
    var date = Date.parse(post.get('created'));
    if(post.get('pinned')) date = new Date('2035', '1', '1');
    return -date;
  },

  sortByEvents(post) {
    var date = new Date('2035', '1', '1');
    if(post.get('type') == 'event') {
      date = Date.parse(post.get('date'));
    }
    return -date;
  }
});

var dispatchToken = Dispatcher.register(PostStore.handleDispatch.bind(PostStore));
PostStore.dispatchToken = dispatchToken;

module.exports = PostStore;
