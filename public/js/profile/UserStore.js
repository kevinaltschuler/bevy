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

  linkedAccounts: new Users,

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:

        this.user = new User(window.bootstrap.user);
        this.user.url = constants.apiurl + '/users/' + this.user.get('_id');

        this.linkedAccounts.url = constants.apiurl + '/users/' + this.user.get('_id') + '/linkedaccounts';
        this.linkedAccounts.fetch({
          success: function(collection, response, options) {
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });

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
      case BEVY.DESTROY:
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
        var image = payload.image;

        this.user.save({
          image: image
        }, {
          patch: true,
          success: function(model, response, options) {
          }.bind(this)
        });
        break;

      case USER.LINK_ACCOUNT:
        var account = payload.account;

        var linkedAccounts = this.user.get('linkedAccounts');
        if(_.isEmpty(linkedAccounts)) linkedAccounts = [];

        linkedAccounts.push(account._id);
        _.uniq(linkedAccounts); // remove dupes

        $.ajax({
          url: constants.apiurl + '/users/' + this.user.get('_id') + '/linkedaccounts',
          method: 'POST',
          data: {
            account_id: account._id
          },
          success: function(data) {

          },
          error: function(error) {
            console.log(error);
          }
        });

        // add to collection
        this.linkedAccounts.push(account);
        this.trigger(USER.CHANGE_ALL);
        break;

      case USER.UNLINK_ACCOUNT:
        var account = payload.account;

        var linkedAccounts = this.user.get('linkedAccounts');
        if(_.isEmpty(linkedAccounts)) linkedAccounts = [];

        linkedAccounts = _.without(linkedAccounts, account._id);
        _.uniq(linkedAccounts); // remove dupes

        $.ajax({
          url: constants.apiurl + '/users/' + this.user.get('_id') + '/linkedaccounts/' + account._id,
          method: 'DELETE',
          success: function(data) {

          },
          error: function(error) {
            console.log(error);
          }
        });

        // remove from collection
        this.linkedAccounts.remove(account._id);
        this.trigger(USER.CHANGE_ALL);
        break;

      case USER.SWITCH_USER:
        var account_id = payload.account_id;
        console.log('switch account', account_id);

        $.ajax({
          url: constants.siteurl + '/switch',
          method: 'POST',
          data: {
            username: 'dummy',
            password: 'dummy',
            user_id: this.user.get('_id'),
            switch_to_id: account_id
          },
          success: function(data) {
            window.location.reload();
          },
          error: function(error) {
            console.log(error);
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

  getUser() {
    return this.user.toJSON();
  },

  getLoggedIn() {
    return _.isEmpty(window.bootstrap.user);
  },

  getLinkedAccounts() {
    return this.linkedAccounts.toJSON();
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
