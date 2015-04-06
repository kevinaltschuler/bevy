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
				var bevy_id = payload.bevy_id;
				var email = payload.email || '';
				var alias_id = payload.alias_id || '';

				var bevy = bevies.get(bevy_id);
				var members = bevy.get('members');

				if(_.isEmpty(alias_id)) {
					// member is invited but has not joined
					// just cancel the invite
					members = _.reject(members, function(member) {
						return member.email == email;
					});
				} else {
					// remove the specific user
					members = _.reject(members, function(member) {
						return member.aliasid == alias_id;
					});
				}

				bevy.set('members', members);

				// save to server
				bevy.save({
					success: function(model, response) {
					}
				});

				this.trigger(BEVY.CHANGE_ALL);

				console.log('leave', bevy_id);
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

			case BEVY.ADD_USER:
				var bevy_id = payload.bevy_id;
				var alias = payload.alias;
				var email = payload.email;

				var bevy = bevies.get(bevy_id);
				var members = bevy.get('members');

				var invited_user = _.find(members, function(member) {
					return member.email == email;
				});

				if(invited_user) {
					// user was already invited and is joining, just add alias id
					var index = members.indexOf(invited_user);
					invited_user.aliasid = alias._id;
					members[index] = invited_user;

				} else {
					// user is being invited, add email
					// add aliasid if it exists, to auto-join
					invited_user = {
						  email: email
						, aliasid: alias._id
					}
					members.push(invited_user);
				}

				bevy.set('members', members);

				// save changes
				bevy.save({
					success: function(model, response) {
					}
				});

				// simulate population
				members[members.indexOf(invited_user)].aliasid = alias;
				bevy.set('members', members);

				//this.trigger(BEVY.CHANGE_ALL);
				console.log(bevy.toJSON());

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
