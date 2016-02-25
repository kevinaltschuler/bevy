/**
 * PostModel.js
 *
 * post backbone model
 * corresponds (hopefully) with the mongoose model
 * in models/Post.js
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var router = require('./../router');
var constants = require('./../constants');

var BevyStore = require('./../bevy/BevyStore');

var constants = require('./../constants');
var POST = constants.POST;

// backbone model
var Post = Backbone.Model.extend({
  idAttribute: '_id',

  /**
   * initialize some key variables for the post object
   * do things here so that our UI doesn't have to
   */
  initialize() {
    var $BevyStore = require('./../bevy/BevyStore');
    // init comment count field
    this.commentCount = 0;

    // determine whether the current user has voted on this or not
    var vote = _.findWhere(this.get('votes'), { voter: window.bootstrap.user._id });
    if(vote == undefined) this.set('voted', false);
    else {
      if(vote.score <= 0) this.set('voted', false);
      else this.set('voted', true);
    }

    // set the vote count for this post
    this.updateVotes();

    // update the comments under this post
    this.updateComments();

    // set the bevy for this post
    this.set('bevy', $BevyStore.getActive());

    // update comments every time this post is synced with the server
    this.on('sync', this.onSync);
  },

  /**
   * called every time the post syncs with the server
   * (aka after a fetch or a save)
   */
  onSync() {
    this.updateComments();
    this.updateVotes();
  },

  /**
   * update the vote data for this post
   */
  updateVotes() {
    // set the vote count
    this.set('voteCount', this.countVotes());
  },

  /**
   * Count the total score that this post has
   */
  countVotes() {
    var sum = 0;
    var votes = this.get('votes');
    if(!_.isEmpty(votes)) {
      votes.forEach(function(vote) {
        sum += vote.score;
      });
    }
    return sum;
  },

  /**
   * update the nested structure of comments for this post
   * also update the comment count for this post
   * the comment count only counts visible comments so comments under a
   * previously deleted one won't count towards the score
   *
   * this is also triggered every time this post object syncs with the server
   */
  updateComments() {
    // reset comment counter var
    this.commentCount = 0;

    var comments = this.get('comments');
    var nestedComments;
    // if no comments, then dont try to recurse
    if(comments == undefined || comments.length <= 0) {
      nestedComments = [];
    } else {
      nestedComments = this.nestComments(comments, null);
    }
    // set new comment fields
    this.set({
      nestedComments: nestedComments,
      commentCount: this.commentCount
    });
  },

  /**
   * recursive function that takes the list of all comments
   * and nests them in a structure that is easy to parse for
   * our UI (CommentView and CommentList)
   */
  nestComments(comments, parentId, depth) {
    // increment depth (used for indenting later)
    // if the depth is specified, then bump it
    if(typeof depth === 'number') depth++;
    // if its not defined, then its probably the first call of this function
    // set it as 0
    else depth = 0;
    // if theres no comments to process, break out
    if(_.isEmpty(comments)) return;
    // also break out if its the end of the recursion line
    if(comments.length < 0) return [];

    // init array of comments to pass back
    var $comments = [];
    // iterate through all comments
    // TODO: splice the matched comment out of the list so we can go faster
    for(var key in comments) {
      var comment = comments[key];
      // look for comments under this one
      if(comment.parentId == parentId) {
        // set the comment depth (to be used by UI)
        comment.depth = depth;
        // and keep going
        comment.comments = this.nestComments(comments, comment._id, depth);
        // iterate comment count (for UI)
        this.commentCount = this.commentCount + 1;
        // push into array to be returned
        $comments.push(comment);
      }
    };
    // return nested comments
    return $comments;
  }
});

module.exports = Post;
