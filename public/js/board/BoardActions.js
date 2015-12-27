/**
 * BoardActions.js
 *
 * Action dispatcher for boards
 *
 * @author kevin
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var BOARD = require('./../constants').BOARD;

var BoardActions = {

  loadBoardView(board_id) {
    dispatch(BOARD.LOADBOARDVIEW, {
      board_id: (board_id == undefined) ? '' : board_id
    });
  },

  create(name, description, image, parent_id) {
    dispatch(BOARD.CREATE, {
      name: (name == undefined) ? '' : name,
      description: (description == undefined) ? '' : description,
      image: (image == undefined) ? {} : image,
      parent_id: (parent_id == undefined) ? '' : parent_id
    });
  },

  destroy(board_id) {
    dispatch(BOARD.DESTROY, {
      board_id: board_id
    });
  },

  update(board_id, name, description, image, settings) {
    dispatch(BOARD.UPDATE, {
      board_id: (board_id == undefined) ? '' : board_id,
      name: (name == undefined) ? null : name,
      description: (description == undefined) ? null : description,
      image: (image == undefined) ? null : image,
      settings: (settings == undefined) ? null : settings
    });
  },

  leave(board_id) {
    dispatch(BOARD.LEAVE, {
      board_id: (board_id == undefined) ? '' : board_id
    });
  },

  join(board_id) {
    dispatch(BOARD.JOIN, {
      board_id: (board_id == undefined) ? '0' : board_id
    });
  },

  switchBoard(board_id) {
    dispatch(BOARD.SWITCH, {
      board_id: (board_id == undefined) ? '0' : board_id
    });
  },

  getBoard(board_id) {
    dispatch(BOARD.GET, {
      board_id: (board_id == undefined) ? '0' : board_id
    });
  }
};

module.exports = BoardActions;
