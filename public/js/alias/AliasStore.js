/**
 * AliasStore.js
 *
 * Backbone and React and Flux confluence
 * for aliases
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var Alias = require('./AliasModel');
var AliasCollection = require('./AliasCollection');

var AliasActions = require('./AliasActions');

// create collection
var aliases = new AliasCollection;

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var AliasStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(AliasStore, {

	handleDispatch: function(payload) {
		switch(payload.actionType) {

		}
	}

});
Dispatcher.register(AliasStore.handleDispatch.bind(AliasStore));
module.exports = AliasStore;
