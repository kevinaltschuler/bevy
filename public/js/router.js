'use strict';

var Backbone = require('backbone');

var Router = Backbone.Router.extend({
	routes: {
		'' : 'home',
		'login' : 'login',
		'register' : 'register',
		'forgot' : 'forgot',
		'reset/:token' : 'reset',
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

	not_found: function(nuts) {
		this.current = '404';
	}
});

var router = new Router();

Backbone.history.start({ pushState: true });

module.exports = router;
