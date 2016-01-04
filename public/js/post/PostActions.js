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
  fetch(board_id) {
    dispatch(POST.FETCH, {
      board_id: (board_id == undefined) ? null : board_id
    });
  },

  create(title, images, board, type, event) {
    dispatch(POST.CREATE, {
      title: title,
      images: (images == undefined) ? [] : images,
      board: board, // grab the current, active bevy
      type: (type == undefined) ? 'default' : type,
      event: (event == undefined) ? null : event
    });
  },

  destroy(post_id) {
    dispatch(POST.DESTROY, {
      post_id: (post_id == undefined) ? '0' : post_id
    });
  },

  update(post_id, title, images, event) {
    dispatch(POST.UPDATE, {
      post_id: post_id,
      title: (title == undefined) ? null : title,
      images: (images == undefined) ? null : images,
      event: (event == undefined) ? null : event
    });
  },

  /**
   * upvote a post
   * @param  {string} post_id
   * @param  {string} voter
   */
  vote(post_id, voter) {
    dispatch(POST.VOTE, {
      post_id: (post_id == undefined) ? '' : post_id,
      voter: (voter == undefined) ? '' : voter
    });
  },

  /**
   * sort the list of posts
   * @param  {string} by        the sorting method ('top', 'new')
   * @param  {string} direction either 'asc' or 'desc'
   */
  sort(by, direction) {
    dispatch(POST.SORT, {
      by: (by == undefined) ? 'new' : by,
      direction: (direction == undefined) ? 'asc' : direction
    });
  },

  pin(post_id) {
    dispatch(POST.PIN, {
      post_id: (post_id == undefined) ? '' : post_id
    });
  },

  cancel() {
    dispatch(POST.CANCEL, {});
  }
};

module.exports = PostActions;
