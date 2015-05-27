'use strict';

var Backbone = require('backbone');

var Router = Backbone.Router.extend({
	routes: {
		'' : 'home',
		'login' : 'login',
		'register' : 'register',
		'forgot' : 'forgot',
		'reset/:token' : 'reset',
		'b' : 'home',
		'b/:bevyid' : 'bevy',
		'search/:query' : 'search',
		'*nuts' : 'not_found'
	},

	home: function() {
		this.current = 'home';
		this.navigate('b/frontpage', { trigger: true });
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

	bevy: function(bevy_id) {
		this.current = 'bevy';
		this.bevy_id = bevy_id;
		if(bevy_id == 'frontpage') this.bevy_id = -1;
	},

	search: function(query) {
		this.current = 'search';
	},

	not_found: function(nuts) {
		this.current = '404';
	}
});

var router = new Router();

Backbone.history.start({ pushState: true });

module.exports = router;
