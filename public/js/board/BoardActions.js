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
var constants = require('./../constants');
var BOARD = require('./../constants').BOARD;

var BoardActions = {

  create(name, description, image, parent_id, type) {
    if(_.isEmpty(name)) return;
    if(_.isEmpty(parent_id)) return;
    if(_.isEmpty(type)) {
      type = 'discussion';
    }
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
      parent_id: parent_id,
      type: type
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

  leave(board) {
    if(_.isEmpty(board)) return;

    Dispatcher.dispatch({
      actionType: BOARD.LEAVE,
      board: board
    });
  },

  join(board) {
    if(_.isEmpty(board)) return;

    Dispatcher.dispatch({
      actionType: BOARD.JOIN,
      board: board,
    });
  },

  switchBoard(board_id) {
    Dispatcher.dispatch({
      actionType: BOARD.SWITCH,
      board_id: (board_id == undefined) ? null : board_id
    });
  },

  addAdmin(board_id, admin) {
    Dispatcher.dispatch({
      actionType: BOARD.ADD_ADMIN,
      board_id: board_id,
      admin: admin
    });
  }
};

module.exports = BoardActions;
