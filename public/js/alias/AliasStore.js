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
		if(collection.models.length < 1) {
			// no aliases yet...
			// lets create one automatically
			var name;
			if(!_.isEmpty(user.google.name)) {
				name = user.google.name.givenName.toLowerCase();
			} else {
				// TODO: regex to strip just the
				// first part of the email address
				name = user.email;
			}
			collection.create({
				name: name
			}, {
				wait: true
			});
		}

		// set the first found alias to the active one
		var first = collection.models[0];
		if(!_.isEmpty(first)) aliases._meta.active = first.id;

		//console.log(aliases);
		AliasStore.trigger(ALIAS.CHANGE_ALL);
	}
});

aliases.on('sync', function() {
	//console.log('sync');
	AliasStore.trigger(ALIAS.CHANGE_ALL);
});

// inherit event class first
var AliasStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(AliasStore, {

	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case ALIAS.CREATE:
				var name = payload.name;
				//console.log(name);

				var newAlias = {
					name: name
				};

				aliases.create(newAlias, {
					//wait: true
				});

				// if this is the only alias, switch to it
				if(aliases.models.length === 1) {
					aliases._meta.active = aliases.models[0].id;
				}

				this.trigger(ALIAS.CHANGE_ALL);

				break;

			case ALIAS.DESTROY:
				var id = payload.id;
				//console.log('destroy', id);
				var alias = aliases.get(id);


				alias.destroy({
					success: function(model, response) {
						this.trigger(ALIAS.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case ALIAS.UPDATE:
				var alias_id = payload.alias_id;
				var name = payload.name;

				var alias = aliases.get(alias_id);

				alias.save({
					name: name
				}, {
					patch: true
				});

				alias.set('name', name);

				this.trigger(ALIAS.CHANGE_ALL);

				break;

			case ALIAS.SWITCH:
				var alias_id = payload.id;
				aliases._meta.active = alias_id;

				this.trigger(ALIAS.CHANGE_ALL);
				break;
		}
	},

	getAll: function() {
		return aliases.toJSON();
	},

	getActive: function() {
		return (aliases._meta.active == null) ? {} : aliases.get(aliases._meta.active);
	}

});
Dispatcher.register(AliasStore.handleDispatch.bind(AliasStore));
module.exports = AliasStore;
