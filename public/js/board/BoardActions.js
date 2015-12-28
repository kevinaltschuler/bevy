/**
 * BoardActions.js
 *
 * Action dispatcher for boards
 *
 * @author kevin
 */

'use strict';

var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var BOARD = require('./../constants').BOARD;

var BoardActions = {
  loadBoardView(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.LOADBOARDVIEW,
      board_id: board_id
    });
  },

  create(name, description, image, parent_id) {
    if(_.isEmpty(name)) return;
    if(_.isEmpty(parent_id)) return;
    if(_.isEmpty(image)) {
      image = {
        filename: constants.siteurl + '/img/default_board_img.png',
        foreign: true
      };
    }

    Dispatcher.dispatch({
      actionType: BOARD.CREATE,
      name: name,
      description: (description == undefined) ? '' : description,
      image: image,
      parent_id: parent_id
    });
  },

  destroy(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.DESTROY,
      board_id: board_id
    });
  },

  update(board_id, name, description, image, settings) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.UPDATE,
      board_id: board_id,
      name: (name == undefined) ? null : name,
      description: (description == undefined) ? null : description,
      image: (image == undefined) ? null : image,
      settings: (settings == undefined) ? null : settings
    });
  },

  leave(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.LEAVE,
      board_id: board_id
    });
  },

  join(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.JOIN,
      board_id: board_id,
    });
  },

  switchBoard(board_id) {
    if(_.isEmpty(board_id)) return;

    Dispatcher.dispatch({
      actionType: BOARD.SWITCH,
      board_id: board_id
    });
  },

  getBoard(board_id) {
    Dispatcher.dispatch({
      actionType: BOARD.GET,
      board_id: (board_id == undefined) ? '' : board_id
    });
  }
};

module.exports = BoardActions;
