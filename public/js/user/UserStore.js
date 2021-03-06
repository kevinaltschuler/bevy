/**
 * UserStore.js
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var USER = constants.USER;
var BEVY = constants.BEVY;
var APP = constants.APP;
var BOARD = constants.BOARD;

var Users = require('./UserCollection');
var User = require('./UserModel');
var BevyStore = require('./../bevy/BevyStore');
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
  tokensLoaded: false,

  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD_USER:
        if(_.isEmpty(window.bootstrap.user)) {
          this.loggedIn = false;
          break;
        } else {
          this.setUser(window.bootstrap.user);
          this.loggedIn = true;
        }
        // check if auth tokens have been passed in from the server
        if(!_.isEmpty(window.bootstrap.access_token)
          && !_.isEmpty(window.bootstrap.refresh_token)) {
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
        this.trigger(USER.LOADED);
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

      case BOARD.JOIN:
        var board = payload.board;

        var boards = this.user.get('boards');
        // if already joined, break
        if(_.contains(boards, board._id)) break;

        boards.push(board._id);
        _.uniq(boards);

        this.user.save({
          boards: boards
        }, {
          patch: true,
          success: function(model, response, options) {
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BOARD.LEAVE:
        var board = payload.board;

        var boards = this.user.get('boards');
        boards = _.reject(boards, function($board_id) {
          return $board_id == board._id;
        });
        _.uniq(boards);

        this.user.save({
          boards: boards
        }, {
          patch: true,
          success: function(model, response, options) {
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case USER.UPDATE:
        let firstName = payload.firstName;
        let lastName = payload.lastName;
        let title = payload.title;
        let phoneNumber = payload.phoneNumber;
        let image = payload.image;

        this.user.url = constants.apiurl + '/users/' + window.bootstrap.user._id;
        this.user.save({
          name: { firstName: firstName, lastName: lastName },
          title: title,
          phoneNumber: phoneNumber,
          image: image
        }, {
          patch: true
        });

        this.trigger(USER.CHANGE_ALL);
        break;

      case USER.SEARCH:
        this.trigger(USER.SEARCHING);

        let query = payload.query;
        let bevy_id = payload.bevy_id;
        let role = payload.role;
        let exclude_users = payload.exclude_users;

        query = encodeURIComponent(query);

        let url = (_.isEmpty(query))
          ? `${constants.apiurl}/users/search?bevy_id=${bevy_id}&role=${role}`
          : `${constants.apiurl}/users/search/${query}?bevy_id=${bevy_id}&role=${role}`;

        // if we're searching through admins, go through a totally different route
        if(role == 'admin') {
          let activeBevy = BevyStore.getActive();
          let admin_ids = _.pluck(activeBevy.admins, '_id');
          for(var key in admin_ids) {
            url += `&admin_ids[${key}]=${admin_ids[key]}`;
          }
        }

        for(var key in exclude_users) {
          url += `&exclude_users[${key}]=${exclude_users[key]}`;
        }

        fetch(url, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
          this.userSearchQuery = query;
          this.userSearchResults.reset(res);
          this.trigger(USER.SEARCH_COMPLETE);
        });
        break;
    }
  },

  addBoard(board) {
    this.user.boards.push(board.get('_id'));
    window.bootstrap.user.boards.push(board.get('_id'));
    this.trigger(USER.CHANGE_ALL);
  },

  addBevy(bevy) {
    this.user.bevies.push(bevy.get('_id'));
    window.bootstrap.user.bevies.push(bevy.get('_id'));
    this.trigger(USER.CHANGE_ALL);
  },

  login(username, password) {
    // trigger logging in for responsive ui
    this.trigger(USER.LOGGING_IN);

    // need to make sure that we're making the fetch request to the same subdomain
    // (or lack of one if we aren't in one) because fetch doesn't allow
    // credentials to be sent over domains

    // set the default login url to the site url
    var login_url = 'http://' + constants.domain;

    // see if theres a subdomain being used - mostly likely there is one being used
    // if the user is logging in from the invite page
    var hostname_chunks = window.location.hostname.split('.');
    if(hostname_chunks.length == 3) {
      // if so, then log into the subdomain instead of the regular siteurl
      login_url = 'http://' + hostname_chunks[0] + '.' + constants.domain;
    }

    // send the request
    fetch(login_url, {
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
      if(!_.isObject(res)) {
        console.log('login error', res.toString());
        // trigger error and pass along error message
        this.trigger(USER.LOGIN_ERROR, res.toString());
        return;
      }
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
    console.log('tokens set!');
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('expires_in', expires_in.toString());
    this.tokensLoaded = true;
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
  getTokensLoaded() {
    return this.tokensLoaded;
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
