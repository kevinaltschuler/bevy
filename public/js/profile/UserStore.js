/**
 * UserStore.js
 * @author albert
 * @author kevin
 * @flow
 */

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
  loggedIn: false,
  userSearchQuery: '',
  userSearchResults: new Users,

  accessToken: '',
  refreshToken: '',
  expires_in: 0,

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        if(_.isEmpty(window.bootstrap.user)) {
          this.loggedIn = false;
        } else {
          this.setUser(window.bootstrap.user);
          this.loggedIn = true;
        }
        // check if auth tokens have been passed in from the server
        if(!_.isEmpty(window.bootstrap.access_token)
          && !_.isEmpty(window.bootstrap.refresh_token)
          && !_.isEmpty(window.bootstrap.expires_in)) {
          this.setTokens(
            window.bootstrap.access_token,
            window.bootstrap.refresh_token,
            window.bootstrap.expires_in
          );
        } else {
          // if not, then try to load from local storage
          this.setTokens(
            localStorage.getItem('access_token'),
            localStorage.getItem('refresh_token'),
            localStorage.getItem('expires_in')
          );
        }
        break;

      case USER.LOGIN:
        var username = payload.username;
        var password = payload.password;
        this.login(username, password);
        break;

      case USER.REGISTER:
        var username = payload.username;
        var password = payload.password;
        var email = payload.email;

        fetch(constants.apiurl + '/users', {
          method: 'POST',
          //credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password,
            email: email
          })
        })
        .then(res => res.json())
        .then(res => {
          console.log('register success', res._id);
          this.trigger(USER.REGISTER_SUCCESS);
          this.login(username, password);
        })
        .catch(error => {
          console.log('register error', error.toString());
          this.trigger(USER.REGISTER_ERROR);
        })
        break;

      case USER.REFRESH_TOKEN:

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

  login(username, password) {
    this.trigger(USER.LOGGING_IN);
    fetch(constants.siteurl + '/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        client_id: constants.client_id,
        client_secret: constants.client_secret,
        grant_type: 'password',
        username: username,
        password: password
      })
    })
    .then(res => res.json())
    .then(res => {
      console.log('login success', res.user._id);
      // set the access and refresh tokens
      this.setTokens(
        res.accessToken,
        res.refreshToken,
        res.expires_in
      );
      // set the new user
      this.setUser(res.user);
      // trigger success
      this.trigger(USER.LOGIN_SUCCESS);
    })
    .catch(err => {
      console.log('login error', err.toString());
      // trigger error and pass along error message
      this.trigger(USER.LOGIN_ERROR, err.toString());
    });
  },

  setUser(user) {
    this.user = new User(user);
    this.user.url = constants.apiurl + '/users/' + this.user.get('_id');
    this.trigger(USER.CHANGE_ALL);
    this.trigger(USER.LOADED);
  },

  getUser() {
    return this.user.toJSON();
  },

  getLoggedIn() {
    return this.loggedIn;
  },

  setTokens(accessToken, refreshToken, expires_in) {
    if(_.isEmpty(accessToken) || _.isEmpty(refreshToken)) {
      // if one of them is missing, then we need to clear all
      console.log('clearing oauth2 tokens');
      this.clearTokens();
      return;
    }
    // set locally
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expires_in = expires_in;
    // and save
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires_in', expires_in.toString());
  },
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
  },
  getAccessToken() {
    return this.accessToken;
  },
  getRefreshToken() {
    return this.refreshToken;
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
