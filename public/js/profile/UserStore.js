'use strict';

// imports
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var USER = constants.USER;

var user = window.bootstrap.user;

var UserStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(UserStore, {

  userSearchQuery: '',
  userSearchResults: [],

  handleDispatch(payload) {
    switch(payload.actionType) {
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
        var query = payload.query;
        if(query == '' || query == undefined) {
          break;
        }
        this.userSearchQuery = 'a8d27dc165db909fcd24560d62760868';
        this.trigger(USER.CHANGE_ALL);
        $.ajax({
          url: constants.apiurl + '/users/search/' + query,
          method: 'GET',
          success: function(data) {
            this.userSearchQuery = query;
            this.userSearchResults = data;
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });
        break;
    }
  },

  getUserSearchQuery() {
    console.log('getting junk');
    return this.userSearchQuery = (this.userSearchQuery) ? this.userSearchQuery : '';
  },

  getUserSearchResults() {
    return this.userSearchResults = (this.userSearchResults) ? this.userSearchResults : [];
  }
});

var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(UserStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;
