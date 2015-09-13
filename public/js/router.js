'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var BevyActions = require('./bevy/BevyActions');

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
    's/' : 'search',
    's' : 'search',
    's/:query' : 'search',
    '*nuts' : 'not_found'
  },

  home() {
    this.current = 'home';
  },

  login() {
    this.current = 'login';
  },

  register() {
    this.current = 'register';
  },

  forgot() {
    this.current = 'forgot';
  },

  reset(token) {
    this.current = 'reset';
  },

  bevy(bevy_id, post_id) {
    this.current = 'bevy';
    if(bevy_id == 'frontpage') bevy_id = '-1';
    this.bevy_id = bevy_id;
    BevyActions.switchBevy(this.bevy_id);
  },

  bevies() {
    //this.navigate('s/?collection=bevies', { trigger: true });
    this.navigate('/s/', { trigger: true });
  },

  search(query) {
    this.current = 'search';

    this.search_query = query;

    if(query == undefined) {
      this.search.query = '';
    }

    BevyActions.search(query);
  },

  not_found: function(nuts) {
    this.current = '404';

    if(!checkUser()) return;
  }
});

function checkUser() {
  if(_.isEmpty(window.bootstrap.user)) {
    router.navigate('login', { trigger: true });
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

Backbone.history.start({ pushState: true });