'use strict';

var Backbone = require('backbone');
//var Store = require('./../shared/libs/Store');
var constants = require('./constants');
var Dispatcher = require('./../shared/dispatcher');


var RouterModel = Backbone.Model.extend({
	initialize: function() {
		console.log('loading router...');
		this.router = new AppRouter;
		this.dispatchId = Dispatcher.register(this.handleDispatch.bind(this));
	},

	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case constants.ROUTE_NAVIGATE:
				console.log('navigating to...', payload.fragment);
				this.router.navigate(payload.fragment, {
					  trigger: payload.trigger
					, replace: payload.replace
				});
				break;
		}
	}
});
// configure router
var AppRouter = Backbone.Router.extend({
	routes: {
		"*actions": 'defaultRoute'
	},

	defaultRoute: function(actions) {
		//alert(actions);
		console.log(actions);
	}
});

// enable backbone routing when DOM is loaded
Backbone.$(document).on('ready', function() {
	Backbone.history.start({ pushState: true });
});

// shoot it back to main app
//var app_router = new AppRouter;
module.exports = new RouterModel();
