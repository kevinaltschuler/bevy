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
var BOARD = constants.BOARD;

var Users = require('./UserCollection');
var User = require('./UserModel');
var ChatStore = require('./../chat/ChatStore');
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

      case BEVY.JOIN:
        var bevy = payload.bevy;
        var bevies = this.user.get('bevies');
        // if already joined, then get outta here
        if(_.contains(bevies, bevy._id)) break;

        // add bevy
        bevies.push(bevy._id);
        _.uniq(bevies);

        // add all of the bevy's boards
        var boards = this.user.get('boards');
        for(var key in bevy.boards) {
          var board = bevy.boards[key];
          // dont automatically join private boards
          if(board.settings.privacy == 'Private') continue;
          boards.push(board._id);
        }
        _.uniq(boards);

        this.user.save({
          bevies: bevies,
          boards: boards
        }, {
          patch: true
        });
        this.trigger(USER.CHANGE_ALL);
        this.trigger(BEVY.CHANGE_ALL);
        break;
      case BEVY.DESTROY:
      case BEVY.LEAVE:
        var bevy = payload.bevy;

        // remove from user's bevy array
        var bevies = this.user.get('bevies');
        bevies = _.reject(bevies, function($bevy_id) {
          return $bevy_id == bevy._id;
        });
        _.uniq(bevies);

        // remove all boards from that bevy from the user
        var boards = this.user.get('boards');
        boards = _.reject(boards, function($board_id) {
          return _.contains(_.pluck(bevy.boards, '_id'), $board_id);
        });
        _.uniq(boards);

        this.user.save({
          bevies: bevies,
          boards: boards
        }, {
          patch: true
        });
        this.trigger(USER.CHANGE_ALL);
        this.trigger(BEVY.CHANGE_ALL);
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
            ChatStore.fetchThreads();
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case BOARD.DESTROY:
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
            ChatStore.fetchThreads();
            this.trigger(CHAT.CHANGE_ALL);
            this.trigger(USER.CHANGE_ALL);
          }.bind(this)
        });
        break;

      case USER.UPDATE:
        var image = payload.image;
        this.user.save({ image: image }, { patch: true });
        this.trigger(USER.CHANGE_ALL);
        break;

      case USER.SEARCH:
        this.trigger(USER.SEARCHING);
        var query = payload.query;

        fetch(constants.apiurl + '/users/search/' + query, {
          method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
          this.userSearchQuery = query;
          this.userSearchResults.reset(res);
          if(!_.isEmpty(user)) {
             // remove self from search results
            this.userSearchResults.remove(user._id);
          }
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
    this.trigger(USER.LOGGING_IN);
    fetch(window.location.href, {
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
