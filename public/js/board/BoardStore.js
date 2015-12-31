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
var Bevy = require('./../bevy/BevyModel');
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
var UserStore = require('./../profile/UserStore');
var ChatStore = require('./../chat/ChatStore');
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
      case BOARD.CREATE:
        var name = payload.name;
        var description = payload.description;
        var image = payload.image;
        var user = window.bootstrap.user;
        var type = payload.type;
        var parent_id = payload.parent_id;

        var board = new Board({
          name: name,
          description: description,
          image: image,
          admins: [user._id],
          type: type,
          parent: parent_id
        });
        board.url = constants.apiurl + '/boards';
        board.save(null, {
          success: function(model, response, options) {
            BevyStore.addBoard(board);
            UserStore.addBoard(board);
          }.bind(this)
        });
        break;

      case BOARD.LOADBOARDVIEW:
        var board_id = payload.board_id;
        this.active.url = constants.apiurl + '/boards/' + board_id;
        this.active.fetch({
          success: function(model, response, options) {
            this.active = model;
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        });

        break;  

      case BOARD.SWITCH:
        var board_id = payload.board_id;
        this.active.url = constants.apiurl + '/boards/' + board_id;
        this.active.fetch({
          success: function(model, response, options) {
            this.active = model;
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        })
        break;

      case BOARD.UPDATE:
        var board_id = payload.board_id;

        var board = this.active;

        var name = payload.name || board.get('name');
        var description = payload.description || board.get('description');
        var image = payload.image || board.get('image');
        var settings = payload.settings || board.get('settings');

        board.set({
          name: name,
          description: description,
          image: image,
          settings: settings
        });

        board.save({
          name: name,
          description: description,
          image: image,
          settings: settings
        }, {
          patch: true,
          success: function() {
            ChatStore.fetchThreads();
          }
        });

        this.trigger(BOARD.CHANGE_ALL);
        break;

      case BOARD.DESTROY:
        var board_id = payload.board_id;
        var board = this.active;
        board.destroy({
          success: function(model, response) {
            console.log('/b/' + model.get('parent').url);
            router.navigate('/b/' + model.get('parent').url, { trigger: true });
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
    if(board_id == this.active.get('_id'))
      return this.active.toJSON();
    return BevyStore.getBoard(board_id);
  },

});

var dispatchToken = Dispatcher.register(BoardStore.handleDispatch.bind(BoardStore));
BoardStore.dispatchToken = dispatchToken;

module.exports = BoardStore;
