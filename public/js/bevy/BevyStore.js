/**
 * BevyStore.js
 *
 * Backbone and React and Flux confluence
 * for bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var Bevy = require('./BevyModel');
var Bevies = require('./BevyCollection');

var BEVY = require('./../constants').BEVY;
var POST = require('./../constants').POST;

var BevyActions = require('./BevyActions');

// create collection
var bevies = new Bevies;
bevies.fetch({
	success: function(collection, response, options) {
		// set the first found bevy to the active one
		var first = collection.get('c1');
		if(!_.isEmpty(first)) bevies._meta.active = first;

		// propagate change
		BevyStore.trigger(BEVY.CHANGE_ALL);
		// also update posts
		// unorthodox and breaks flux flow...
		// but whatever. will figure out a better way later
		BevyActions.switchBevy(collection.get('c1').id);
	}
});

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {
	// handle calls from the dispatcher
	// these are created from BevyActions.js
	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case BEVY.SWITCH:
				var id = payload.id;
				bevies._meta.active = id;
				this.trigger(BEVY.CHANGE_ALL);
				break;
		}
	},

	getAll: function() {
		return bevies.toJSON();
	},

	getActive: function() {
		return (bevies._meta.active == null) ? {} : bevies.get(bevies._meta.active);
	}
});
Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
module.exports = BevyStore;
