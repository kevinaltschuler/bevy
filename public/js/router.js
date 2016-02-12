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
var ChatStore = require('./chat/ChatStore');
var BoardStore = require('./board/BoardStore');

var Router = Backbone.Router.extend({
  routes: {
    '' : 'home',
    'login' : 'login',
    'forgot' : 'forgot',
    'reset/:token' : 'reset',
    'invite/:token' : 'invite',
    'create' : 'newBevy',
    'create/' : 'newBevy',
    'boards/:boardid' : 'board',
    'boards/:boardid/' : 'board',
    'boards/:boardid/posts/:postid': 'post',
    'boards/:boardid/posts/:postid/': 'post',
    'boards/:boardid/posts/:postid/comment/:commentid': 'post',
    'boards/:boardid/posts/:postid/comment/:commentid/': 'post',
    's/' : 'search',
    's' : 'search',
    's/:query' : 'search',
    '*nuts' : 'notFound'
  },

  home() {
    console.log(this.checkUser(), window.bootstrap);
    var hostname_chunks = window.location.hostname.split('.');
    if(hostname_chunks.length == 2) {
      // we don't have a subdomain
      this.current = 'home';
      return;
    } else if (hostname_chunks.length == 3) {
      // we're in a bevy subdomain, probably
      //if(!checkUser()) {
        // slow navigate to home
        //window.location.href = constants.siteurl;
        //return;
      //}
      this.bevy_slug = hostname_chunks[0];
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

  invite() {
    this.current = 'invite';
  },

  login() {
    this.current = 'login';
  },

  forgot() {
    this.current = 'forgot';
  },

  reset(token) {
    this.current = 'reset';
    this.reset_token = token;
  },

  board(board_id) {
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
    this.current = 'board';
    this.board_id = board_id;
    //BoardActions.switchBoard(this.board_id);
  },

  post(board_id, post_id, comment_id) {
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
    this.current = 'post';
    this.board_id = board_id;
    this.post_id = post_id;
    this.comment_id = (comment_id == undefined) ? null : comment_id;
  },

  bevies() {
    if(!this.checkUser()) {
      this.current = 'home';
      return;
    }
    //this.navigate('s/?collection=bevies', { trigger: true });
    this.navigate('/s/', { trigger: true });
  },

  search(query) {
    if(!this.checkUser()) {
      this.current = 'home';
      return;
    }
    this.current = 'search';
    this.search_query = query;
    if(query == undefined) {
      this.search.query = '';
    }
  },

  notFound(nuts) {
    console.log('page not found :(', nuts);
    this.notFoundURL = nuts || '';
    this.current = '404';
  },

  checkUser() {
    if(_.isEmpty(window.bootstrap.user)) {
      return false
    }
    return true
  }
});

var router = new Router();
module.exports = router;

Backbone.history.start({ pushState: true });
