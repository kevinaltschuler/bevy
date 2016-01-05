/**
 * BevyStore.js
 *
 * Backbone and React and Flux confluence
 * for bevies
 *
 * @author albert
 * go home, bert
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

var Bevy = require('./BevyModel');
var Bevies = require('./BevyCollection');
var Boards = require('./../board/BoardCollection');
var Invites = require('./InviteCollection');
var Invite = require('./InviteModel');

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CONTACT = constants.CONTACT;
var CHAT = constants.CHAT;
var APP = constants.APP;
var INVITE = constants.INVITE;
var BOARD = constants.BOARD;
var NOTIFICATION = constants.NOTIFICATION;
var BevyActions = require('./BevyActions');
var UserStore = require('./../profile/UserStore');
var user = window.bootstrap.user;

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {

  myBevies: new Bevies,
  active: new Bevy,
  publicBevies: new Bevies,
  searchQuery: '',
  searchList: new Bevies,
  bevyBoards: new Boards,
  bevyInvites: new Invites,

  handleDispatch(payload) {
    switch(payload.actionType) {

      case BEVY.LOADMYBEVIES:
        var user = window.bootstrap.user;
        this.myBevies.url = constants.apiurl + '/users/' + user._id + '/bevies';

        this.myBevies.fetch({
          success: function(collection, response, options) {
            this.trigger(BEVY.LOADED);
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BEVY.LOADBEVYVIEW:
        var bevy_id_or_slug = payload.bevy_id;
        var user = window.bootstrap.user;
        this.myBevies.url = constants.apiurl + '/users/' + user._id + '/bevies';

        this.active.url = constants.apiurl + '/bevies/' + bevy_id_or_slug;
        this.active.fetch({
          success: function(model, response, options) {
            this.bevyBoards = new Bevies(this.active.get('boards'));

            this.bevyInvites.url = constants.apiurl + '/bevies/'
              + this.active.attributes._id + '/invites';
            this.bevyInvites.fetch({
              success: function(collection, response, options) {
                this.trigger(BEVY.CHANGE_ALL);
              }.bind(this)
            });
          }.bind(this)
        });

        this.myBevies.fetch({
          success: function(collection, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;
      case BOARD.LOADBOARDVIEW:
        var user = window.bootstrap.user;
        this.myBevies.url = constants.apiurl + '/users/' + user._id + '/bevies';
        this.myBevies.fetch({
          success: function(collection, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BEVY.CREATE:
        var name = payload.name;
        var image = payload.image;
        var slug = payload.slug;
        var user = window.bootstrap.user;
        var privacy = payload.privacy;

        // sanitize slug before we continue;
        if(_.isEmpty(slug)) {
          slug = getSlug(name);
        } else {
          // double check to make sure its url friendly
          slug = getSlug(slug);
        }

        var bevy = this.myBevies.add({
          name: name,
          image: image,
          slug: slug,
          admins: [user._id],
          boards: [],
          settings: {
            privacy: privacy
          }
        });
        bevy.url = constants.apiurl + '/bevies';
        bevy.save(null, {
          success: function(model, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
            UserStore.addBevy(bevy);
          }.bind(this)
        });
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
        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) return;

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
        break;

      case BEVY.LEAVE:
        var bevy = payload.bevy;
        // if we haven't joined yet, break
        if(this.myBevies.get(bevy._id) == undefined) break;
        // remove from my bevies collection
        this.myBevies.remove(bevy._id);
        // trigger UI changes
        this.trigger(BEVY.CHANGE_ALL);
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

      case BEVY.REQUEST_JOIN:
        var bevy_id = payload.bevy_id;
        if(this.myBevies.get(bevy_id) != undefined) break;

        var invite = new Invite({
          user: window.bootstrap.user._id,
          type: 'bevy',
          requestType: 'request_join',
          bevy: bevy_id
        });
        invite.url = constants.apiurl + '/invites';
        invite.save();
        break;

      case BEVY.SORT:
        var filter = payload.filter;
        var collection = this.searchList;
        collection.filter = filter;
        switch(filter) {
          case 'Most Subscribers':
            collection.comparator = collection.sortByTop;
            break;
          case 'Least Subscribers':
            collection.comparator = collection.sortByBottom;
            break;
          case 'Newest':
            collection.comparator = collection.sortByNew;
            break;
          case 'Oldest':
            collection.comparator = collection.sortByOld;
            break;
          case 'ABC':
            collection.comparator = collection.sortByAbc;
            break;
          case 'ZYX':
            collection.comparator = collection.sortByZyx;
            break;
        }
        collection.sort();
        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(BEVY.SEARCH_COMPLETE);
        break;

      case BEVY.SEARCH:
        var query = payload.query;
        this.searchQuery = query;
        this.searchList.reset();
        this.trigger(BEVY.SEARCHING);

        if(_.isEmpty(query))
          this.searchList.url = constants.apiurl + '/bevies';
        else
          this.searchList.url = constants.apiurl + '/bevies/search/' + query;

        this.searchList.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.trigger(BEVY.SEARCH_COMPLETE);
            this.searchList.comparator = this.searchList.sortByTop;
          }.bind(this)
        });
        break;

      case INVITE.INVITE_USER:
        var user = payload.user;
        var user_id = user._id;

        var invite = this.bevyInvites.add({
          user: user_id,
          type: 'bevy',
          requestType: 'invite',
          bevy: this.active.get('_id')
        });
        invite.url = constants.apiurl + '/invites';
        invite.save(null, {
          success: function(model, response, options) {
            invite.set('user', user);
            invite.set('_id', model.get('_id'));
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case INVITE.DESTROY:
        var invite_id = payload.invite_id;
        var invite = this.bevyInvites.remove(invite_id);
        this.trigger(BEVY.CHANGE_ALL);
        if(invite == undefined)
          break;
        invite.url = constants.apiurl + '/invites/' + invite_id;
        invite.destroy();

        break;

      case INVITE.ACCEPT_REQUEST:
        var invite_id = payload.invite_id;
        fetch(constants.apiurl + '/invites/' + invite_id + '/accept')
        .then(function(data) {
          // remove from collection if success
          this.bevyInvites.remove(invite_id);
          // trigger UI changes
          this.trigger(BEVY.CHANGE_ALL);
          this.trigger(NOTIFICATION.CHANGE_ALL);
        }.bind(this))
        break;
    }
  },

  addBoard(board) {
    this.bevyBoards.add(board);
    this.trigger(BOARD.CHANGE_ALL);
    this.trigger(BEVY.CHANGE_ALL);
  },

  getMyBevies() {
    return this.myBevies.toJSON();
  },

  getPublicBevies() {
    return (this.publicBevies.models.length <= 0)
    ? []
    : this.publicBevies.toJSON();
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
    return this.bevyBoards.toJSON() || [];
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
    var board = this.bevyBoards.get(board_id);
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
