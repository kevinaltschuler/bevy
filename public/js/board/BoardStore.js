/**
 * BoardStore.js
 *
 * Backbone and React and Flux confluence
 * for boards
 *
 * @author kevin
 * lets fucking go
 */

'use strict';

// imports
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var async = require('async');
var getSlug = require('speakingurl');

var router = require('./../router');

var Dispatcher = require('./../shared/dispatcher');

var Board = require('./BoardModel');
var Boards = require('./BoardCollection');

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CONTACT = constants.CONTACT;
var CHAT = constants.CHAT;
var APP = constants.APP;
var BOARD = constants.BOARD;
var BoardActions = require('./BoardActions');
var BevyStore = require('./../bevy/BevyStore');
var user = window.bootstrap.user;

// inherit event class first
var BoardStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BoardStore, {
  active: new Board,

  // handle calls from the dispatcher
  // these are created from BoardActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {
      case BOARD.LOADBOARDVIEW:
        var board_id = payload.board_id;
        console.log('switching to: ', board_id);
        this.active.url = constants.apiurl + '/boards/' + board_id;
        this.active.fetch({
          success: function(model, response, options) {
            this.active = model;
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        })
        break;

      case BOARD.SWITCH:
        var board_id = payload.board_id;
        console.log('switching to: ', board_id);
        this.active.url = constants.apiurl + '/boards/' + board_id;
        this.active.fetch({
          success: function(model, response, options) {
            this.active = model;
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        })
        break;

    }
  },

  /*getBoards() {
    return this.boards.toJSON() || [];
  },*/

  getActive() {
    var active = (this.active)
    ? this.active.toJSON()
    : {};
    return active;
  },

  getBoard(board_id) {
    //console.log('get board: ', board_id);
    if(board_id == 0) {
      return {};
    }
    var board = this.boards.get(board_id);
    if(board == undefined) {
      // couldnt find so fetch from server
      $.ajax({
        method: 'GET',
        url: constants.apiurl + '/boards/' + board_id,
        success: function($board, more) {
          if(_.isEmpty($board)) {
            var board = {};
          } else {
            var board =$board;
          }
        }.bind(this)
      });
    } else {
      // we found it so return
      return (board)
        ? board.toJSON()
        : {};
    }

  },

});

var dispatchToken = Dispatcher.register(BoardStore.handleDispatch.bind(BoardStore));
BoardStore.dispatchToken = dispatchToken;

module.exports = BoardStore;
