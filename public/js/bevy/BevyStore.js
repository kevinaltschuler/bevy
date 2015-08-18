/**
 * BevyStore.js
 *
 * Backbone and React and Flux confluence
 * for bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var async = require('async');

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

var BevyActions = require('./BevyActions');

//var ChatStore = require('./../chat/ChatStore');

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
        var user = window.bootstrap.user;

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
        var description = payload.description;
        var image_url = payload.image_url;
        var user = window.bootstrap.user;

        var newBevy = this.myBevies.add({
          name: name,
          description: description,
          image_url: image_url,
          admins: [user._id]
        });

        console.log(newBevy);

        newBevy.save(null, {
          success: function(model, response, options) {
            // success
            newBevy.set('_id', model.id);

            this.publicBevies.add(model);

            // switch to bevy
            router.navigate('/b/' + model.id, { trigger: true });

            this.trigger(BEVY.CHANGE_ALL);

            var bevy_ids = this.myBevies.pluck('_id');
            bevy_ids.push(model.id);

            $.ajax({
              method: 'PATCH',
              url: constants.apiurl + '/users/' + user._id,
              data: {
                bevies: bevy_ids
              },
              success: function($user) {
                this.trigger(BEVY.CHANGE_ALL);
              }.bind(this)
            });
          }.bind(this)
        });

        break;

      case BEVY.DESTROY:
        var id = payload.id;
        var bevy = this.myBevies.get(id);
        bevy.destroy({
          success: function(model, response) {
            // switch to the frontpage
            router.navigate('/b/frontpage', { trigger: true });

            // update posts
            BevyActions.switchBevy();

            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.UPDATE:
        var bevy_id = payload.bevy_id;

        var bevy = this.myBevies.get(bevy_id);

        var name = payload.name || bevy.get('name');
        var description = payload.description || bevy.get('description');
        var image_url = payload.image_url || bevy.get('image_url');
        var settings = payload.settings || bevy.get('settings');
        var tags = (bevy.get('tags')) ? bevy.get('tags') : [];

        if(!_.isEmpty(payload.tag)) {
          tags.push(payload.tag);
        }

        console.log(tags);

        bevy.set({
          name: name,
          description: description,
          image_url: image_url,
          tags: tags,
          settings: settings
        });

        bevy.save({
          name: name,
          description: description,
          image_url: image_url,
          tags: tags,
          settings: settings
        }, {
          patch: true
        });

        console.log(bevy.get('tags'));

        this.trigger(BEVY.CHANGE_ALL);
        this.trigger(BEVY.UPDATED_IMAGE);

        break;

      case BEVY.LEAVE:
        var bevy_id = payload.bevy_id;
        var bevy = this.myBevies.get(bevy_id);
        var user = window.bootstrap.user;
        var user_id = user._id;

        // if not joined
        if(this.myBevies.get(bevy_id) == undefined) break;

        if(bevy == undefined) {
          // not found
          break;
        }
        var bevies = _.reject(user.bevies, function(bevy) {
          return bevy_id == ((_.isObject(bevy)) ? bevy._id : bevy);
        });

        this.myBevies.remove(bevy_id);

        user.bevies = bevies;

        this.trigger(BEVY.CHANGE_ALL);

        //if(bevy == undefined) break;

        /*var members = bevy.get('members');

        var user = window.bootstrap.user;
        var user_id = user._id;
        var email = user.email;*/

        /*var member = _.find(members, function($member, index) {
          if(!$member.user) return false; // skip members who haven't joined yet
          return (email == $member.email || user_id == $member.user._id);
        });

        if(member == undefined) break;*/

        $.ajax({
          method: 'PATCH',
          url: constants.apiurl + '/users/' + user_id,
          data: {
            bevies: _.pluck(bevies, '_id')
          },
          success: function($user) {
            // ok, now remove the bevy from the local list
            //user.bevies = $user.bevies
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.JOIN:
        var bevy_id = payload.bevy_id;
        var user = window.bootstrap.user;

        // if already joined, break
        if(this.myBevies.get(bevy_id) != undefined) break;

        $.ajax({
          method: 'GET',
          url: constants.apiurl + '/bevies/' + bevy_id,
          success: function(bevy) {
            this.myBevies.add(bevy);
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        var bevy_ids = this.myBevies.pluck('_id');
        bevy_ids.push(bevy_id);

        this.trigger(BEVY.CHANGE_ALL);

        $.ajax({
          method: 'PATCH',
          url: constants.apiurl + '/users/' + user._id,
          data: {
            bevies: bevy_ids
          },
          success: function($user) {
            console.log('joined');
            this.trigger(BEVY.CHANGE_ALL);
          }.bind(this)
        });

        break;

      case BEVY.SWITCH:
        var bevy_id = payload.bevy_id;

        this.active = bevy_id;

        this.activeTags = []
        if(this.myBevies.get(this.active))
          this.activeTags = this.myBevies.get(this.active).toJSON().tags;

        this.trigger(BEVY.CHANGE_ALL);

        break;

      case BEVY.SORT:
        var filter = payload.filter;
        
        var collection = (!_.isEmpty(this.searchQuery)) ? this.searchList : this.publicBevies;
        collection.filter == filter;
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
        }

        this.trigger(BEVY.CHANGE_ALL);
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
        var tags = (_.isEmpty(payload.tags)) ? [] : payload.tags;
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
    var active = this.myBevies.get(this.active);
    if(active == undefined) return {};
    else return active.toJSON();
  },

  getBevy(bevy_id) {
    var bevy = this.myBevies.get(bevy_id);
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

  getActiveTags() {
    return this.activeTags;
  },

  sortByTop(bevy) {
    var subs = bevy.subs;
    return -subs;
  },
  sortByBottom(bevy) {
    var subs = bevy.subs;
    return subs;
  },
  sortByNew(bevy) {
    var date = Date.parse(bevy.get('created'));
    return -date;
  },
  sortByOld(bevy) {
    var date = Date.parse(bevy.get('created'));
    console.log(date);
    return date;
  }
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;


var myBevies = window.bootstrap.myBevies || [];
BevyStore.myBevies.reset(myBevies);
/*BevyStore.myBevies.unshift({
  _id: '-1',
  name: 'Frontpage'
});*/
BevyStore.trigger(BEVY.CHANGE_ALL);


BevyStore.myBevies.on('sync', function() {
  //console.log('synced');

  //BevyStore.trigger(BEVY.CHANGE_ALL);
});

module.exports = BevyStore;
