/**
 * BevyStore.js
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var async = require('async');
var getSlug = require('speakingurl');

var router = require('./../router');

var Dispatcher = require('./../shared/dispatcher');

var Bevy = require('./BevyModel');
var Bevies = require('./BevyCollection');
var Boards = require('./../board/BoardCollection');
var Invites = require('./InviteCollection');
var Invite = require('./InviteModel');

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
  bevyInvites: new Invites,

  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
        this.active = new Bevy(window.bootstrap.user.bevy);
        var router = require('./../router');
        var bevy_slug = router.bevy_slug;

        this.boards.url = constants.apiurl + '/bevies/' + bevy_slug + '/boards';
        this.boards.fetch({
          success: function(collection, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });
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

      case BEVY.LEAVE:
        var bevy = payload.bevy;
        // if we haven't joined yet, break
        if(this.myBevies.get(bevy._id) == undefined) break;
        // remove from my bevies collection
        this.myBevies.remove(bevy._id);
        // trigger UI changes
        this.trigger(BEVY.CHANGE_ALL);
        var router = require('./../router');
        // if we're viewing that bevy right now, then go back to my bevies
        if(router.current == 'bevy') {
          window.location.href = constants.siteurl;
        }
        break;

      case BEVY.JOIN:
        // add bevy to mybevies collection
        var bevy = payload.bevy;
        // if its already in our collection, then break
        if(this.myBevies.get(bevy._id) != undefined) break;
        // add to collection
        this.myBevies.add(bevy);
        // trigger UI changes
        this.trigger(BEVY.CHANGE_ALL);
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
    var bevy =
      this.myBevies.get(bevy_id) ||
      this.publicBevies.get(bevy_id) ||
      this.searchList.get(bevy_id);
    return (bevy)
    ? bevy.toJSON()
    : {};
  },

  getBevyBoards() {
    return this.boards.toJSON() || [];
  },

  getSearchList() {
    return this.searchList.toJSON();
  },

  getSearchQuery() {
    return this.searchQuery;
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
  },

  getInvites() {
    return this.bevyInvites.toJSON();
  }
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;
