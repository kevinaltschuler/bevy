/**
 * PostActions.js
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var POST = require('./../constants').POST;

var PostActions = {
  fetch(board_id) {
    Dispatcher.dispatch({
      actionType: POST.FETCH,
      board_id: board_id
    });
  },

  fetchSingle(post_id) {
    Dispatcher.dispatch({
      actionType: POST.FETCH_SINGLE,
      post_id: post_id
    });
  },

  create(title, images, board, type, event) {
    Dispatcher.dispatch({
      actionType: POST.CREATE,
      title: title,
      images: (images == undefined) ? [] : images,
      board: board, // grab the current, active bevy
      type: (type == undefined) ? 'default' : type,
      event: (event == undefined) ? null : event
    });
  },

  destroy(post_id) {
    Dispatcher.dispatch({
      actionType: POST.DESTROY,
      post_id: post_id
    });
  },

  update(post_id, title, images, event) {
    Dispatcher.dispatch({
      actionType: POST.UPDATE,
      post_id: post_id,
      title: (title == undefined) ? null : title,
      images: (images == undefined) ? null : images,
      event: (event == undefined) ? null : event
    });
  },

  vote(post_id, voter) {
    Dispatcher.dispatch({
      actionType: POST.VOTE,
      post_id: post_id,
      voter: voter
    });
  },

  sort(by, direction) {
    Dispatcher.dispatch({
      actionType: POST.SORT,
      by: (by == undefined) ? 'new' : by,
      direction: (direction == undefined) ? 'asc' : direction
    });
  },

  /**
   * search for posts
   * @param {string} query - search query to match on the server. if empty will just
   * fetch some random posts based on the bevy/board restrictions
   * @param {string} bevy_id - restrict post search to a certain bevy's boards
   * @param {string} board_id - restrict post search to a certain board. if this is not null,
   * then the bevy_id parameter is ignored
   */
  search(query, bevy_id, board_id) {
    Dispatcher.dispatch({
      actionType: POST.SEARCH,
      query: (query == undefined) ? null : query,
      bevy_id: (bevy_id == undefined) ? null : bevy_id,
      board_id: (board_id == undefined) ? null : board_id
    });
  },

  pin(post_id) {
    Dispatcher.dispatch({
      actionType: POST.PIN,
      post_id: post_id
    });
  },

  cancel() {
    Dispatcher.dispatch({
      actionType: POST.CANCEL
    });
  }
};

module.exports = PostActions;
