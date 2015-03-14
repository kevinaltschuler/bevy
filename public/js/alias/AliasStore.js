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
var ALIAS = require('./../constants').ALIAS;

var Dispatcher = require('./../shared/dispatcher');

var Alias = require('./AliasModel');
var AliasCollection = require('./AliasCollection');

var AliasActions = require('./AliasActions');

// create collection
var aliases = new AliasCollection;
var user = window.bootstrap.user;
aliases._meta.userid = user._id;
aliases.fetch({
	success: function(collection, response, options) {
		//console.log(aliases);
		AliasStore.trigger(ALIAS.CHANGE_ALL);
	}
});

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var AliasStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(AliasStore, {

	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case ALIAS.SETUSER:
				break;
		}
	},

	getAll: function() {
		return aliases.toJSON();
	}

});
Dispatcher.register(AliasStore.handleDispatch.bind(AliasStore));
module.exports = AliasStore;
