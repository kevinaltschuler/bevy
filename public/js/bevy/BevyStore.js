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
var $ = require('jquery');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var Bevy = require('./BevyModel');
var Bevies = require('./BevyCollection');

var constants = require('./../constants');
var BEVY = require('./../constants').BEVY;
var POST = require('./../constants').POST;

var BevyActions = require('./BevyActions');

var user = window.bootstrap.user;

// create collection
var bevies = new Bevies;
bevies.fetch({
	success: function(collection, response, options) {
		// set the first found bevy to the active one
		var first = collection.models[0];
		if(!_.isEmpty(first)) bevies._meta.active = first.id;

		// propagate change
		BevyStore.trigger(BEVY.CHANGE_ALL);
		// also update posts
		// unorthodox and breaks flux flow...
		// but whatever. will figure out a better way later
		BevyActions.switchBevy(collection.get('c1').id);
	}
});

bevies.on('sync', function() {
	BevyStore.trigger(BEVY.CHANGE_ALL);
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

			case BEVY.CREATE:
				var name = payload.name;
				var members = [];
				payload.members.forEach(function(email) {
					members.push({
						email: email
					});
				});

				// add yerself
				members.push({
					  email: user.email
					//, aliasid: '' // TODO: add this when aliases are integrated
				});

				//console.log(name, members);
				var newBevy = {
					  name: name
					, members: members
				};
				bevies.create(newBevy, {
					wait: true
				});

				break;

			case BEVY.DESTROY:
				var id = payload.id;
				//console.log('destroy', id);
				//bevies.remove(bevies.get(id));
				var bevy = bevies.get(id);
				bevy.destroy({
					success: function(model, response) {
						//console.log(model);
						// switch the active bevy
						var newBevy = bevies.models[0];
						if(!newBevy) {
							// no more bevies.
							// what to do here?
						}
						bevies._meta.active = newBevy.id;

						// update posts
						BevyActions.switchBevy(newBevy.id);

						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.LEAVE:
				var id = payload.id;
				console.log('leave', id);
				break;

			case BEVY.SWITCH:
				var id = payload.id;
				bevies._meta.active = id;
				this.trigger(BEVY.CHANGE_ALL);
				break;

			case BEVY.INVITE:
				var bevy = payload.bevy;
				var alias = payload.alias;
				var members = payload.members;

				console.log(bevy, members);

				// create notification
				// which sends email
				$.post(
					constants.apiurl + '/notifications',
					{
						  event: 'invite:email'
						, members: members
						, bevy: bevy
						, alias: alias
					},
					function(data) {
						console.log(data);
					}
				).fail(function(jqXHR) {
					var response = jqXHR.responseJSON;
					console.log(response);
				}.bind(this));

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
