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
  active: {},

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
      case BOARD.SWITCH:
        //console.log('BOARD STORE');
        var board_id = payload.board_id;
        //console.log('switching to: ', board_id);
        $.ajax({
          method: 'GET',
          url: constants.apiurl + '/boards/' + board_id,
          success: function($board, more) {
            if(!_.isEmpty($board)) {
              this.active = $board;
              this.trigger(BOARD.CHANGE_ALL);
            }
          }.bind(this)
        });
      
        break;
      case BOARD.CREATE:
        var name = payload.name;
        var description = payload.description;
        var image = payload.image;
        var user = window.bootstrap.user;
        var parent_id = payload.parent_id;

        if(_.isEmpty(image)) {
          image = {filename: constants.siteurl + '/img/default_board_img.png', foreign: true};
        }

        if(_.isEmpty(parent_id))
          break;

        var newBoard = this.boards.add({
          name: name,
          description: description,
          image: image,
          admins: [user._id],
          parent: parent_id
        });

        newBoard.url = constants.apiurl + '/boards';

        newBoard.save(null, {
          success: function(model, response, options) {
            console.log(model.toJSON());
            // success
            newBoard.set('_id', model.id);

            board_id = model.id;

            // switch to board
            this.active = board_id;

            this.trigger(BOARD.CHANGE_ALL);

            // TODO: move this to user store
            $.ajax({
              method: 'POST',
              url: constants.apiurl + '/users/' + user._id + '/boards',
              data: {
                board: board_id
              },
              success: function($user) {
                //window.location.href = constants.siteurl + model.get('url');
              }.bind(this)
            });
            // TODO: move to bevy store
            $.ajax({
              method: 'POST',
              url: constants.apiurl + '/bevies/' + model.toJSON().parent + '/boards',
              data: {
                board: board_id
              },
              success: function($user) {
              }.bind(this)
            });
          }.bind(this)
        });

        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;
        var user = window.bootstrap.user;

        this.boards.url = constants.apiurl + '/bevies/' + bevy_id + '/boards';

        this.boards.fetch({
          success: function(collection, response, options) {
            //console.log(collection, response);
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        });
        break;
    }
  },

  getBoards() {
    return this.boards.toJSON() || [];
  },

  getActive() {
    return this.active;
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
