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
var user = window.bootstrap.user;

// inherit event class first
var BoardStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BoardStore, {

  boards: new Boards,
  active: 0,

  // handle calls from the dispatcher
  // these are created from BoardActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        var user = window.bootstrap.user;

        this.boards.fetch({
          success: function(collection, response, options) {
            this.trigger(BOARD.CHANGE_ALL);
            this.trigger(BOARD.LOADED);
          }.bind(this)
        });
        break;
    }
  },

  getBoards() {
    return this.boards.toJSON();
  },

  getActive() {
    var active = this.boards.get(this.active) || {};
    if(_.isEmpty(active)) {
      return {};
    }
    else return active.toJSON();
  },

  getBoard(board_id) {
    var board = this.boards.get(board_id);
    return (board)
    ? board.toJSON()
    : {};
  },

});

var dispatchToken = Dispatcher.register(BoardStore.handleDispatch.bind(BoardStore));
BoardStore.dispatchToken = dispatchToken;

module.exports = BoardStore;
