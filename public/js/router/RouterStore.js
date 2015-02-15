'use strict';

var Backbone = require('backbone');
var constants = require('./constants');
var routes = require('./routes');
var Dispatcher = require('./../shared/dispatcher');


var RouterModel = Backbone.Model.extend({
	defaults: {
		  route: routes.ROUTE_DEFAULT
		, params: []
	},

	initialize: function() {
		console.log('loading router...');
		this.router = new AppRouter(this, routes.ROUTE_ROUTES);
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
	//routes: routes.ROUTE_ROUTES,

	initialize: function(store, routes) {
		this.store = store;

		// loop thru routes and manually register each one
		var route, key;
		for(key in routes) {
			if(routes.hasOwnProperty(key)) {
				route = routes[key];
				// register route with the router
				this.route(key, route, function() {
					// emit the route action
					this.emitRouteAction.apply(this, arguments);
				}.bind(this, route));
			}
		}

		// catch all non-matching urls
		Backbone.history.handlers.push({
			route: /(.*)/,
			callback: function() {
				store.set({
					  route: constants.ROUTE_DEFAULT
					, params: []
				});
			}
		});

		// enable backbone routing when DOM is loaded
		Backbone.$(document).on('ready', function() {
			Backbone.history.start({ pushState: true });
		});

	},

	//defaultRoute: function(actions) {
		//alert(actions);
	//	console.log(actions);
	//},

	emitRouteAction: function() {
		this.store.set({
			  route: arguments[0]
			, params: [].slice.call(arguments, 1)
		});
	}
});


// shoot it back to main app
module.exports = new RouterModel();
