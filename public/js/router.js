'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

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
    'home' : 'home',
    'newbevy' : 'newBevy',
    'newbevy/' : 'newBevy',
    'bevies': 'bevies',
    'b' : 'home',
    'b/' : 'home',
    'b/:bevyid' : 'bevy',
    'b/:bevyid/' : 'bevy',
    'boards/:boardid' : 'board',
    'boards/:boardid/' : 'board',
    'boards/:boardid/posts/:postid': 'post',
    'boards/:boardid/posts/:postid/': 'post',
    'boards/:boardid/posts/:postid/comment/:commentid': 'post',
    'boards/:boardid/posts/:postid/comment/:commentid/': 'post',
    's/' : 'search',
    's' : 'search',
    's/:query' : 'search',
    'auth/google/callback': 'googleCallback',
    'auth/facebook/callback': 'facebookCallback',
    '*nuts' : 'not_found'
  },

  home() {
    this.current = 'home';
  },

  newBevy() {
    this.current = 'newBevy';
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

  bevy(bevy_slug, post_id) {
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
    this.current = 'bevy';
    this.bevy_slug = bevy_slug;
    //BevyActions.switchBevy(this.bevy_slug);
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
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
    //this.navigate('s/?collection=bevies', { trigger: true });
    this.navigate('/s/', { trigger: true });
  },

  search(query) {
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
    this.current = 'search';
    this.search_query = query;
    if(query == undefined) {
      this.search.query = '';
    }
  },

  googleCallback() {
    this.navigate('/', { trigger: true });
  },
  facebookCallback() {
    this.navigate('/', { trigger: true });
  },

  not_found(nuts) {
    console.log('page not found :(', nuts);
    this.current = '404';
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
  }
});

function checkUser() {
  //console.log(window.bootstrap);
  if(_.isEmpty(window.bootstrap.user)) {
    return false
  }
  return true
}

var router = new Router();
module.exports = router;

Backbone.history.start({ pushState: true });
