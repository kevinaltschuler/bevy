'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var BevyActions = require('./bevy/BevyActions');
var BoardActions = require('./board/BoardActions');

var Router = Backbone.Router.extend({
  routes: {
    '' : 'home',
    'login' : 'login',
    'register' : 'register',
    'forgot' : 'forgot',
    'reset/:token' : 'reset',
    'home' : 'home',
    'bevies': 'bevies',
    'b' : 'home',
    'b/' : 'home',
    'b/:bevyid' : 'bevy',
    'b/:bevyid/' : 'bevy',
    'b/:bevyid/post' : 'bevy',
    'b/:bevyid/post/' : 'bevy',
    'b/:bevyid/post/:postid' : 'bevy',
    'boards/:boardid' : 'board',
    'boards/:boardid/' : 'board',
    's/' : 'search',
    's' : 'search',
    's/:query' : 'search',
    '*nuts' : 'not_found'
  },

  home() {
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
    this.current = 'myBevies';
  },

  myBevies() {
    if(!checkUser()) {
      this.current = 'home';
      return;
    }
    this.current = 'myBevies';
  },

  login() {
    if(checkUser()) {
      this.current = 'myBevies';
      return;
    }
    this.current = 'login';
  },

  register() {
    if(checkUser()) {
      this.current = 'myBevies';
      return;
    }
    this.current = 'register';
  },

  forgot() {
    if(checkUser()) {
      this.current = 'myBevies';
      return;
    }
    this.current = 'forgot';
  },

  reset(token) {
    if(checkUser()) {
      this.current = 'myBevies';
      return;
    }
    this.current = 'reset';
  },

  bevy(bevy_id, post_id) {
    if(!checkUser()) {
      this.current = 'home;'
      return;
    }
    this.current = 'bevy';
    if(bevy_id == 'frontpage') bevy_id = '-1';
    this.bevy_id = bevy_id;
    BevyActions.switchBevy(this.bevy_id);
  },

  board(board_id) {
    if(!checkUser()) {
      this.current = 'home'
      return;
    }
    this.current = 'board';
    this.board_id = board_id;
    BoardActions.switchBoard(this.board_id);
  },

  bevies() {
    if(!checkUser()) {
      this.current = 'home;'
      return;
    }
    //this.navigate('s/?collection=bevies', { trigger: true });
    this.navigate('/s/', { trigger: true });
  },

  search(query) {
    if(!checkUser()) {
      this.current = 'home;'
      return;
    }
    this.current = 'search';
    this.search_query = query;
    if(query == undefined) {
      this.search.query = '';
    }
    BevyActions.search(query);
  },

  not_found: function(nuts) {
    console.log('page not found :(');
    this.current = '404';
    if(!checkUser()) {
      this.current = 'home;'
      return;
    }
  }
});

function checkUser() {
  if(_.isEmpty(window.bootstrap.user)) {
    return false
  }
  return true
}

var router = new Router();
module.exports = router;

// include these just to register the dispatchers immediately
var PostStore = require('./post/PostStore');
var BevyStore = require('./bevy/BevyStore');
var NotificationStore = require('./notification/NotificationStore');
var UserStore = require('./profile/UserStore');
var ChatStore = require('./chat/ChatStore');
var BoardStore = require('./board/BoardStore');

Backbone.history.start({ pushState: true });