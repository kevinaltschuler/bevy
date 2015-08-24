'use strict';

// imports
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var USER = constants.USER;
var BEVY = constants.BEVY;
var APP = constants.APP;

var Users = require('./UserCollection');
var User = require('./UserModel');

var user = window.bootstrap.user;

var UserStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(UserStore, {

  user: new User,
  userSearchQuery: '',
  userSearchResults: new Users,

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:

        this.user = new User(window.bootstrap.user);
        this.user.url = constants.apiurl + '/users/' + this.user.get('_id');

        break;
      case BEVY.JOIN:
        // add to users bevies array
        var bevy_id = payload.bevy_id;

        var bevies = this.user.get('bevies');
        if(_.contains(bevies, bevy_id)) break; // already joined

        bevies.push(bevy_id);
        _.uniq(bevies); // ensure that theres no dupes

        this.user.save({
          bevies: bevies
        }, {
          patch: true,
          success: function(model, response, options) {

          }.bind(this)
        });
        break;
      case BEVY.LEAVE:
        // remove from users bevies array
        var bevy_id = payload.bevy_id;

        var bevies = this.user.get('bevies');
        bevies = _.reject(bevies, function($bevy_id) {
          return $bevy_id == bevy_id;
        });
        _.uniq(bevies); // ensure that theres no dupes

        this.user.save({
          bevies: bevies
        }, {
          patch: true,
          success: function(model, response, options) {

          }.bind(this)
        });

        break;
      case USER.UPDATE:
        var image_url = payload.image_url;

        $.ajax({
          url: constants.apiurl + '/users/' + user._id,
          method: 'PATCH',
          data: {
            image_url: image_url
          },
          success: function(data) {

          }
        });

        break;
      case USER.SEARCH:
        this.trigger(USER.SEARCHING);
        var query = payload.query;
        if(query == '' || query == undefined) {
          break;
        }
        $.ajax({
          url: constants.apiurl + '/users/search/' + query,
          method: 'GET',
          success: function(data) {
            //console.log('search data', data);
            this.userSearchQuery = query;
            this.userSearchResults.reset(data);
            if(!_.isEmpty(user))
              this.userSearchResults.remove(user._id); // remove self from search results
            this.trigger(USER.SEARCH_COMPLETE);
          }.bind(this)
        });
        break;
    }
  },

  getUserSearchQuery() {
    return this.userSearchQuery;
  },

  getUserSearchResults() {
    return this.userSearchResults.toJSON();
  }
});

var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(UserStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;
