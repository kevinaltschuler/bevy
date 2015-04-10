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
var APP = require('./../constants').APP;

var Dispatcher = require('./../shared/dispatcher');

var Alias = require('./AliasModel');
var AliasCollection = require('./AliasCollection');

var AliasActions = require('./AliasActions');

// inherit event class first
var AliasStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(AliasStore, {

	aliases: new AliasCollection,

	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case APP.LOAD:

				var user = window.bootstrap.user;
				this.aliases._meta.userid = user._id;

				this.aliases.fetch({
					async: false,
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
						if(!_.isEmpty(first)) this.aliases._meta.active = first.id;

						//console.log(this.aliases);
						this.trigger(ALIAS.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case ALIAS.CREATE:
				var name = payload.name;

				var newAlias = {
					name: name
				};
				this.aliases.create(newAlias);

				// if this is the only alias, switch to it
				if(this.aliases.models.length === 1) {
					this.aliases._meta.active = this.aliases.models[0].id;
				}

				this.trigger(ALIAS.CHANGE_ALL);

				break;

			case ALIAS.DESTROY:
				var id = payload.id;
				var alias = this.aliases.get(id);

				alias.destroy({
					success: function(model, response) {
						this.trigger(ALIAS.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case ALIAS.UPDATE:
				var alias_id = payload.alias_id;
				var name = payload.name;

				var alias = this.aliases.get(alias_id);

				alias.save({
					name: name
				}, {
					patch: true
				});

				alias.set('name', name);

				break;

			case ALIAS.SWITCH:
				var alias_id = payload.id;
				this.aliases._meta.active = alias_id;

				this.trigger(ALIAS.CHANGE_ALL);

				break;
		}
	},

	getAll: function() {
		return this.aliases.toJSON();
	},

	getActive: function() {
		return (this.aliases._meta.active == null)
		? {}
		: this.aliases.get(this.aliases._meta.active);
	}

});

var dispatchToken = Dispatcher.register(AliasStore.handleDispatch.bind(AliasStore));
AliasStore.dispatchToken = dispatchToken;

module.exports = AliasStore;
