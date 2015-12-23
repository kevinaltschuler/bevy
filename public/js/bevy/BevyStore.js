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

var constants = require('./../constants');
var BEVY = constants.BEVY;
var POST = constants.POST;
var CONTACT = constants.CONTACT;
var CHAT = constants.CHAT;
var APP = constants.APP;
var BOARD = constants.BOARD;
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
  active: -2,
  publicBevies: new Bevies,
  searchQuery: '',
  searchList: new Bevies,
  activeTags: [],

  // handle calls from the dispatcher
  // these are created from BevyActions.js
  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        Dispatcher.waitFor([ UserStore.dispatchToken ]);
        var user = window.bootstrap.user;
        this.myBevies.fetch({
          success: function(collection, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
            this.trigger(BEVY.LOADED);
          }.bind(this)
        });
        this.publicBevies.url = constants.apiurl + '/bevies';
        //load public bevies
        this.publicBevies.fetch({
          success: function(collection, response, options) {
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.CREATE:
        var name = payload.name;
        //var description = payload.description;
        var image = payload.image;
        var slug = payload.slug;
        var user = window.bootstrap.user;

        if(_.isEmpty(image)) {
          image = {filename: constants.siteurl + '/img/default_group_img.png', foreign: true};
        }

        // sanitize slug before we continue;
        if(_.isEmpty(slug)) {
          slug = getSlug(name);
        } else {
          // double check to make sure its url friendly
          slug = getSlug(slug);
        }

        var newBevy = this.myBevies.add({
          name: name,
          //description: description,
          image: image,
          slug: slug,
          admins: [user._id],
          boards: []
        });

        newBevy.save(null, {
          success: function(model, response, options) {
            // success
            newBevy.set('_id', model.id);

            this.publicBevies.add(model);

            // switch to bevy
            this.active = model.id;

            var bevy_ids = this.myBevies.pluck('_id');
            bevy_ids.push(model.id);

            this.trigger(BEVY.CHANGE_ALL);

            // TODO: move this to user store
            $.ajax({
              method: 'PATCH',
              url: constants.apiurl + '/users/' + user._id,
              data: {
                bevies: bevy_ids
              },
              success: function($user) {
                window.location.href = constants.siteurl + model.get('url');
              }.bind(this)
            });
          }.bind(this)
        });

        break;

      case BEVY.DESTROY:
        var bevy_id = payload.bevy_id;
        var bevy = this.myBevies.get(bevy_id);
        bevy.destroy({
          success: function(model, response) {
            // switch to the frontpage
            router.navigate('/b/frontpage', { trigger: true });

            // update posts
            BevyActions.switchBevy();

            this.myBevies.remove(bevy_id);
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.UPDATE:
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);

        var name = payload.name || bevy.get('name');
        var description = payload.description || bevy.get('description');
        var image = payload.image || bevy.get('image');
        var settings = payload.settings || bevy.get('settings');
        var tags = payload.tags || bevy.get('tags');
        var siblings = payload.siblings || bevy.get('siblings');

        bevy.set({
          name: name,
          description: description,
          image: image,
          tags: tags,
          siblings: siblings,
          settings: settings
        });

        bevy.save({
          name: name,
          description: description,
          image: image,
          tags: tags,
          siblings: siblings,
          settings: settings
        }, {
          patch: true
        });

        this.trigger(BEVY.UPDATED_IMAGE);
        this.trigger(POST.CHANGE_ALL);
        break;

      case BEVY.LEAVE:
        // remove bevy from mybevies collection
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);
        if(bevy == undefined) break; // we havent joined yet

        this.myBevies.remove(bevy_id);
        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.ADD_USER:
        var bevy_id = payload.bevy_id;
        var user_id = payload.user_id;
        var email = payload.email;

        $.ajax({
          method: 'PATCH',
          url: constants.apiurl + '/users/' + user_id + '/addbevy/' + bevy_id,
          success: function(res) {
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.JOIN:
        // add bevy to mybevies collection
        var bevy_id = payload.bevy_id;
        if(this.myBevies.get(bevy_id) != undefined) break; // already joined

        // fetch new bevy from server
        var new_bevy = new Bevy;
        new_bevy.url = constants.apiurl + '/bevies/' + bevy_id;
        new_bevy.fetch({
          success: function(model, response, options) {
            // add to collection
            this.myBevies.add(new_bevy);
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.REQUEST_JOIN:
        var bevy = payload.bevy;
        var user = payload.user;

        if(this.myBevies.get(bevy._id) != undefined) break; // already joined

        $.ajax({
          method: 'POST',
          url: constants.apiurl + '/notifications',
          data: {
            event: 'bevy:requestjoin',
            bevy_id: bevy._id,
            bevy_name: bevy.name,
            user_id: user._id,
            user_name: user.displayName,
            user_image: user.image_url,
            user_email: user.email
          },
          success: function(res) {
          }.bind(this)
        });

        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;
        this.active = bevy_id;

        if(bevy_id == '-1') {
          this.trigger(BEVY.CHANGE_ALL);
          break;
        }

        this.trigger(BEVY.CHANGE_ALL);
        break;

      case BEVY.SORT:
        var filter = payload.filter;

        var collection = (!_.isEmpty(this.searchQuery)) ? this.searchList : this.publicBevies;
        collection.filter = filter;
        switch(filter) {
          case 'top':
            collection.comparator = this.sortByTop;
            break;
          case 'bottom':
            collection.comparator = this.sortByBottom;
            break;
          case 'new':
            collection.comparator = this.sortByNew;
            break;
          case 'old':
            collection.comparator = this.sortByOld;
            break;
          case 'abc':
            collection.comparator = this.sortByAbc;
            break;
          case 'zyx':
            collection.comparator = this.sortByZyx;
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
        this.searchList.url = constants.apiurl + '/bevies/search/' + query;
        this.searchList.fetch({
          reset: true,
          success: function(collection, response, options) {
            this.trigger(BEVY.SEARCH_COMPLETE);
          }.bind(this)
        });
        break;

      case BEVY.UPDATE_TAGS:
        var tags = payload.tags || [];
        this.activeTags = tags;
        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(POST.CHANGE_ALL);
        break;
    }
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
    return this.getBevy(this.active);
  },

  getBevy(bevy_id) {
    var bevy = this.myBevies.get(bevy_id) || this.publicBevies.get(this.active);
    return (bevy)
    ? bevy.toJSON()
    : {};
  },

  getSearchList() {
    return (this.searchList.models.length <= 0)
    ? []
    : this.searchList.toJSON();
  },

  getSearchQuery() {
    return this.searchQuery;
  },
  /*
  getActiveTags() {
    return this.activeTags;
  },

  sortByAbc(bevy) {
    var name = bevy.attributes.name.toLowerCase();
    var nameValue = name.charCodeAt(0);
    return nameValue;
  },

  sortByZyx(bevy) {
    var name = bevy.attributes.name.toLowerCase();
    var nameValue = name.charCodeAt(0);
    return -nameValue;
  },

  sortByTop(bevy) {
    var subs = bevy.attributes.subCount;
    return -subs;
  },
  sortByBottom(bevy) {
    var subs = bevy.attributes.subCount;
    return subs;
  },
  sortByNew(bevy) {
    var date = Date.parse(bevy.get('created'));
    return -date;
  },
  sortByOld(bevy) {
    var date = Date.parse(bevy.get('created'));
    return date;
  }
  */
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;
