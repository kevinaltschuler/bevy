'use strict';

// imports
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var USER = constants.USER;

var Users = require('./UserCollection');

var user = window.bootstrap.user;

var UserStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(UserStore, {

  userSearchQuery: '',
  userSearchResults: new Users,

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
