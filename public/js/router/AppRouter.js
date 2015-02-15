'use strict';

var Backbone = require('backbone');

console.log('loading router...');

// configure router
var AppRouter = Backbone.Router.extend({
	routes: {
		"*actions": 'defaultRoute'
	},

	defaultRoute: function(actions) {
		alert(actions);
		//console.log(actions);
	}
});

// enable backbone routing when DOM is loaded
Backbone.$(document).on('ready', function() {
	Backbone.history.start({ pushState: true });
});

// shoot it back to main app
var app_router = new AppRouter;
module.exports = app_router;
