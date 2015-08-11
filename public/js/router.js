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
		'publicbevies' : 'publicbevies',
		'bevies': 'publicbevies',
		'b' : 'home',
		'b/' : 'home',
		'b/frontpage': 'home',
		'b/:bevyid' : 'superBevy',
		'b/:bevyid/' : 'superBevy',
		'b/:bevyid/post' : 'superBevy',
		'b/:bevyid/post/' : 'superBevy',
		'b/:bevyid/post/:postid' : 'superBevy',
		'b/:bevyid/:subbevyid' : 'subBevy',
		'b/:bevyid/:subbevyid/post' : 'subBevy',
		'b/:bevyid/:subbevyid/post/' : 'subBevy',
		'b/:bevyid/:subbevyid/post/:postid' : 'subBevy',
		's/' : 'search',
		's' : 'search',
		's/:query' : 'search',
		'*nuts' : 'not_found'
	},

	home: function() {
		this.current = 'home';
	},

	login: function() {
		this.current = 'login';
	},

	register: function() {
		this.current = 'register';
	},

	forgot: function() {
		this.current = 'forgot';
	},

	reset: function(token) {
		this.current = 'reset';
	},

	publicbevies: function() {
		this.current = 'publicbevies';
	},

	superBevy: function(bevy_id, post_id) {
		this.current = 'superBevy';
		this.bevy_id = bevy_id;
		this.superBevy_id = bevy_id;
		this.subbevy_id = null;
		//console.log('router super');
		//BevyActions.switchSuper(this.bevy_id);
		BevyActions.switchBevy(this.superBevy_id, this.subbevy_id);
	},

	subBevy: function(bevy_id, subbevy_id, post_id) {
		this.superBevy_id = bevy_id;
		this.bevy_id = bevy_id;
		this.subbevy_id = subbevy_id;
		//console.log('router sub');
		//BevyActions.switchSub(this.subbevy_id);
		BevyActions.switchBevy(this.superBevy_id, this.subbevy_id);
		this.current = 'subBevy';
	},

	search: function(query) {
		this.current = 'search';

		if(!checkUser()) return;

		if(query == undefined) {
			// get all posts
			return;
		}

		this.search_query = query;
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
var ContactStore = require('./contact/ContactStore');

Backbone.history.start({ pushState: true });