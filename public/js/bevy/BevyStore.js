/**
 * BevyStore.js
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var async = require('async');
var getSlug = require('speakingurl');

var router = require('./../router');

var Dispatcher = require('./../shared/dispatcher');

var Bevy = require('./BevyModel');
var Bevies = require('./BevyCollection');
var Board = require('./../board/BoardModel');
var Boards = require('./../board/BoardCollection');

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var APP = constants.APP;
var INVITE = constants.INVITE;
var BOARD = constants.BOARD;
var NOTIFICATION = constants.NOTIFICATION;
var BevyActions = require('./BevyActions');
var UserStore = require('./../user/UserStore');
var user = window.bootstrap.user;

var BevyStore = _.extend({}, Backbone.Events);
_.extend(BevyStore, {

  active: new Bevy,
  boards: new Boards,
  activeBoard: -1,

  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
        // load the bevy thats packaged with the user into the active bevy object
        this.active = new Bevy(window.bootstrap.user.bevy);
        this.boards = new Boards(window.bootstrap.user.boards);
        // collect some vars from the router
        var router = require('./../router');
        var bevy_slug = router.bevy_slug;
        var board_id = router.board_id;

        // if there's a board id specified in the url, then set it to the active board
        if(board_id != undefined) {
          this.activeBoard = board_id;
        }

        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.CREATE:
        //bevyName, bevyImage, bevySlug, adminEmail, adminName, inviteEmails
        var bevyName = payload.bevyName;
        var bevyImage = payload.bevyImage;
        var bevySlug = payload.bevySlug;
        var adminEmail = payload.adminEmail;
        var adminName = payload.adminName;
        var inviteEmails = payload.inviteEmails;

        fetch(constants.apiurl + '/bevies', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bevy_name: bevyName,
            bevy_image: bevyImage,
            bevy_slug: bevySlug,
            admin_email: adminEmail,
            admin_username: adminName,
            invite_emails: inviteEmails
          })
        })
        .then(res => res.json())
        .then(res => {
          console.log('BEVY CREATE SUCCESS')
          this.trigger(BEVY.CREATE_SUCCESS, res);
        })
        .catch(err => {
          console.log('bevy create error', JSON.parse(err))
          this.trigger(BEVY.CREATE_ERR, JSON.parse(err));
        })

        break;

      case BEVY.DESTROY:
        var bevy = payload.bevy;
        fetch(constants.apiurl + '/bevies/' + bevy._id, {
          method: 'DELETE'
        })
        .then(res => res.json())
        .then(res => {
          window.location.href = constants.siteurl;
        });
        break;

      case BEVY.UPDATE:
        var bevy_id = payload.bevy_id;
        var bevy = this.active;
        if(_.isEmpty(this.active)) {
          return;
        }

        var name = payload.name || bevy.get('name');
        var image = payload.image || bevy.get('image');
        var settings = payload.settings || bevy.get('settings');

        bevy.url = constants.apiurl + '/bevies/' + bevy_id;
        bevy.save({
          name: name,
          image: image,
          settings: settings
        }, {
          patch: true
        });
        bevy.set({
          name: name,
          image: image,
          settings: settings
        });
        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(BOARD.CHANGE_ALL);
        break;

      case BOARD.CREATE:
        var router = require('./../router');

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
            board.set('admins', [window.bootstrap.user]);
            // add to the collection of boards
            this.boards.add(board);
            // switch to it and change the url
            router.navigate('/boards/' + board.get('_id'));
            this.activeBoard = board.get('_id');
            // trigger UI changes
            this.trigger(BEVY.CHANGE_ALL);
            this.trigger(BOARD.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BOARD.SWITCH:
        var board_id = payload.board_id;

        // if no board is passed in, clear the active board field
        // and break out
        if(!board_id) {
          this.activeBoard = -1;
          this.trigger(BOARD.CHANGE_ALL);
          break;
        }

        var board = this.boards.get(board_id);
        if(board == undefined) {
          // if the board id to switch to is invalid,
          // clear the active board
          this.activeBoard = -1;
          this.trigger(BOARD.CHANGE_ALL);
        } else {
          this.activeBoard = board_id;
          this.trigger(BOARD.SWITCHED);
          this.trigger(BOARD.CHANGE_ALL);
        }
        break;

      case BOARD.UPDATE:
        var board_id = payload.board_id;
        var board = this.boards.get(board_id);
        if(board == undefined) break;

        var name = payload.name || board.get('name');
        var description = payload.description || board.get('description');
        var image = payload.image || board.get('image');
        var settings = payload.settings || board.get('settings');

        board.url = constants.apiurl + '/boards/' + board.get('_id');
        board.save({
          name: name,
          description: description,
          image: image,
          settings: settings
        }, { patch: true });

        this.trigger(BOARD.CHANGE_ALL);
        break;

      case BOARD.ADD_ADMIN:
        var board_id = payload.board_id;
        var board = this.boards.get(board_id);
        if(board == undefined) break;

        var admin = payload.admin;
        var board_admins = board.get('admins');

        board.url = `${constants.apiurl}/boards/${board.get('_id')}`;
        board.save({
          admins: _.pluck(board_admins, '_id')
        }, { patch: true });

        board.set('admins', board_admins);

        this.trigger(BOARD.CHANGE_ALL);
        break;

      case BOARD.DESTROY:
        var router = require('./../router');
        var board_id = payload.board_id;
        var board = this.boards.remove(board_id);

        if(board == undefined) break;

        // send the destroy request
        board.url = constants.apiurl + '/boards/' + board.get('_id');
        board.destroy();

        // switch back to the home feed
        this.activeBoard = -1;
        setTimeout(() => {
          router.navigate('/', { trigger: true })
        }, 250);

        this.trigger(BOARD.CHANGE_ALL);
        break;
    }
  },

  addBoard(board) {
    this.boards.add(board);
    this.trigger(BOARD.CHANGE_ALL);
    this.trigger(BEVY.CHANGE_ALL);
  },

  getActive() {
    return (!_.isEmpty(this.active))
      ? this.active.toJSON()
      : {};
  },
  getActiveBevy() {
    return this.getActive();
  },

  getBevy(bevy_id) {
    return this.active.toJSON();
  },

  getBevyBoards() {
    return this.boards.toJSON() || [];
  },

  getActiveBoard() {
    var board = this.boards.get(this.activeBoard);
    return (board == undefined) ? {} : board.toJSON();
  },

  getBoard(board_id) {
    if(_.isEmpty(board_id)) {
      return {};
    }
    var board = this.boards.get(board_id);
    if(board == undefined) {
      return {};
    } else {
      // we found it so return
      return (board)
        ? board.toJSON()
        : {};
    }
  }
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;
