/**
 * BoardStore.js
 * @author kevin
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var async = require('async');
var getSlug = require('speakingurl');

var Board = require('./BoardModel');
var Bevy = require('./../bevy/BevyModel');
var Boards = require('./BoardCollection');

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var router = require('./../router');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CHAT = constants.CHAT;
var APP = constants.APP;
var BOARD = constants.BOARD;
var BoardActions = require('./BoardActions');
var BevyStore = require('./../bevy/BevyStore');
var UserStore = require('./../user/UserStore');
var ChatStore = require('./../chat/ChatStore');
var user = window.bootstrap.user;

var BoardStore = _.extend({}, Backbone.Events);
_.extend(BoardStore, {
  active: new Board,

  handleDispatch(payload) {
    switch(payload.actionType) {

      case POST.FETCH_SINGLE:
        fetch(constants.apiurl + '/boards/' + require('./../router').board_id)
        .then(res => res.json())
        .then(res => {
          this.active = new Board(res);
          this.trigger(BOARD.CHANGE_ALL);
        });
        break;

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
          success: function(model, response, options) {
            //window.location.reload();
          }.bind(this)
        });

        break;

      case BOARD.DESTROY:
        var board_id = payload.board_id;
        var board = this.active;
        board.destroy({
          success: function(model, response) {
            window.location.href = constants.siteurl + model.get('parent').url;
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
