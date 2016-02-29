/**
 * router.js
 *
 * handles all routes for the react app
 *
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var constants = require('./constants');

var BevyActions = require('./bevy/BevyActions');
var BoardActions = require('./board/BoardActions');

// include these just to register the dispatchers immediately
var PostStore = require('./post/PostStore');
var BevyStore = require('./bevy/BevyStore');
var NotificationStore = require('./notification/NotificationStore');
var UserStore = require('./user/UserStore');
var AppStore = require('./app/AppStore');

var Router = Backbone.Router.extend({
  routes: {
    // home page/catch unauthorized stuff
    '' : 'home',

    // auth routes
    'signin' : 'loginSlug',
    'signin/' : 'loginSlug',
    'forgot/group' : 'forgotGroup',
    'forgot/group/' : 'forgotGroup',
    'forgot/' : 'forgot',
    'forgot' : 'forgot',
    'reset/:token' : 'reset',
    'invite/:token' : 'invite',
    'unauthorized' : 'unauth',
    'unauthorized/' : 'unauth',

    'create' : 'newBevy',
    'create/' : 'newBevy',


    // ==================
    // routes that are only available when inside a bevy subdomain
    // ==================

    // board routes
    'boards/:boardid' : 'board',
    'boards/:boardid/' : 'board',
    'boards/:boardid/posts/:postid': 'post',
    'boards/:boardid/posts/:postid/': 'post',
    'boards/:boardid/posts/:postid/comment/:commentid': 'post',
    'boards/:boardid/posts/:postid/comment/:commentid/': 'post',

    // profile routes
    'profile/edit' : 'editProfile',
    'profile/edit/' : 'editProfile',

    // catch everything else and 404
    '*nuts' : 'notFound'
  },

  home() {
    var hostname_chunks = window.location.hostname.split('.');
    if(hostname_chunks.length == 2) {
      // we don't have a subdomain
      if(this.checkUser()) {
        // user is logged in
        // go to their bevy's page
        //var user = window.bootstrap.user;
        //window.location.href = 'http://' + user.bevy.slug + '.' + constants.domain;
        //return;
        this.current = 'home';
        return;
      } else {
        this.current = 'home';
        return;
      }
    } else if (hostname_chunks.length == 3) {
      // we're in a bevy subdomain, probably
      this.bevy_slug = hostname_chunks[0];
      if(!this.checkUser()) {
        // go to login page
        this.current = 'login';
        return;
      }

      BoardActions.switchBoard(null);
      this.current = 'bevy';

      return;
    } else if (hostname_chunks.length > 3) {
      // invalid subdomain structure
      this.notFound();
      return;
    }
  },

  newBevy() {
    this.current = 'newBevy';
  },

  invite(token) {
    this.inviteToken = token;
    this.current = 'invite';
  },

  login() {
    this.current = 'login';
  },

  loginSlug() {
    this.current = 'loginSlug';
  },

  forgot() {
    this.current = 'forgot';
  },

  forgotGroup() {
    this.current = 'forgotGroup';
  },

  reset(token) {
    this.current = 'reset';
    this.reset_token = token;
  },

  unauth() {
    this.checkSubdomain();
    this.current = 'unauth';
  },

  board(board_id) {
    if(!this.checkUser() || !this.checkSubdomain()) {
      this.current = 'home';
      return;
    }
    this.current = 'board';
    this.board_id = board_id;
    BoardActions.switchBoard(this.board_id);
  },

  post(board_id, post_id, comment_id) {
    if(!this.checkUser() || !this.checkSubdomain()) {
      this.current = 'home';
      return;
    }
    this.post_id = post_id;
    this.comment_id = (comment_id == undefined) ? null : comment_id;
    this.board(board_id);
  },

  editProfile(username) {
    if(!this.checkUser()) return this.home();
    if(!this.checkSubdomain()) return this.notFound();
    this.profile_username = username;
    this.current = 'edit-profile';
  },

  notFound(nuts) {
    console.log('page not found :(', nuts);
    this.notFoundURL = nuts || '';
    this.current = '404';
  },

  checkUser() {
    if(_.isEmpty(window.bootstrap.user)) {
      return false
    } else return true
  },

  checkSubdomain() {
    var hostname_chunks = window.location.hostname.split('.');
    if(hostname_chunks.length == 3) {
      this.bevy_slug = hostname_chunks[0];
      return true;
    } else return false;
  },

  get(key) {
    return this[key];
  }
});

var router = new Router();
module.exports = router;

Backbone.history.start({ pushState: true });
