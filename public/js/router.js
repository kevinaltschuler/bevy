'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Router = Backbone.Router.extend({
	routes: {
		'' : 'home',
		'login' : 'login',
		'register' : 'register',
		'forgot' : 'forgot',
		'reset/:token' : 'reset',
		'b' : 'home',
		'b/' : 'home',
		'b/:bevyid' : 'bevy',
		'search/:query' : 'search',
		'*nuts' : 'not_found'
	},

	home: function() {
		this.current = 'home';

		if(!checkUser()) return;

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

		if(!checkUser()) return;

		this.bevy_id = bevy_id;
		if(bevy_id == 'frontpage') this.bevy_id = -1;
		if(bevy_id == '') {
			this.bevy_id = -1;
			this.navigate('/b/frontpage');
		}
	},

	search: function(query) {
		this.current = 'search';

		if(!checkUser()) return;
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

Backbone.history.start({ pushState: true });

module.exports = router;
