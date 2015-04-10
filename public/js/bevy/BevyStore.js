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
var ALIAS = constants.ALIAS;
var BEVY = constants.BEVY;
var POST = constants.POST;
var APP = constants.APP;

var AliasStore = require('./../alias/AliasStore');

var BevyActions = require('./BevyActions');

var user = window.bootstrap.user;


// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {

	bevies: new Bevies,

	// handle calls from the dispatcher
	// these are created from BevyActions.js
	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case APP.LOAD:
				// populate aliases first
				Dispatcher.waitFor([AliasStore.dispatchToken]);

				var alias = AliasStore.getActive();
				this.bevies._meta.alias = alias;

				this.bevies.fetch({
					async: false,
					success: function(collection, response, options) {
						// set the first found bevy to the active one
						var first = collection.models[0];
						if(!_.isEmpty(first)) this.bevies._meta.active = first.id;

						// propagate change
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case ALIAS.SWITCH:

				// wait for alias switch
				Dispatcher.waitFor([AliasStore.dispatchToken]);

				var alias = AliasStore.getActive();
				this.bevies._meta.alias = alias;

				if(_.isEmpty(alias)) {
					this.bevies.reset();
					this.trigger(BEVY.CHANGE_ALL);
				} else {
					this.bevies.fetch({
						reset: true,
						async: false,
						success: function(collection, response, options) {
							// set the first found bevy to the active one
							var first = collection.models[0];
							if(!_.isEmpty(first)) this.bevies._meta.active = first.id;

							// propagate change
							this.trigger(BEVY.CHANGE_ALL);
						}.bind(this)
					});
				}

				break;

			case BEVY.CREATE:
				var name = payload.name;
				var description = payload.description;
				var alias_id = payload.alias_id;

				var members = [];
				payload.members.forEach(function(email) {
					members.push({
						email: email
					});
				});

				// add yerself
				members.push({
					email: user.email,
					aliasid: alias_id
				});

				//console.log(name, members);
				var newBevy = {
					name: name,
					description: description,
					members: members
				};
				this.bevies.create(newBevy, {
					wait: true
				});

				break;

			case BEVY.DESTROY:
				var id = payload.id;
				//console.log('destroy', id);
				//bevies.remove(bevies.get(id));
				var bevy = this.bevies.get(id);
				bevy.destroy({
					success: function(model, response) {
						//console.log(model);
						// switch the active bevy
						var newBevy = this.bevies.models[0];
						if(!newBevy) {
							// no more bevies.
							// what to do here?
							this.bevies._meta.active = null;
						}
						this.bevies._meta.active = newBevy.id;

						// update posts
						BevyActions.switchBevy(newBevy.id);

						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.UPDATE:
				var bevy_id = payload.bevy_id;
				var name = payload.name;
				var description = payload.description;

				var bevy = this.bevies.get(bevy_id);

				if(!_.isEmpty(name)) bevy.set('name', name);
				if(!_.isEmpty(description)) bevy.set('description', description);

				bevy.save({
					name: name,
					description: description
				}, {
					patch: true
				});

				break;

			case BEVY.SET_NOTIFICATION_LEVEL:

				var bevy_id = payload.bevy_id;
				var alias_id = payload.alias_id;
				var level = payload.level;

				//console.log(bevy_id, alias_id, level);

				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				// set level
				members = _.map(members, function(member) {
					if(member.aliasid._id == alias_id) {
						member.notificationLevel = level;
						return member;
					} else return member;
				});

				//console.log(members);

				// unpopulate member aliasid
				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.aliasid))
						member.aliasid = member.aliasid._id;
					return member;
				});

				// save to server
				bevy.save({
					members: unpopulated_members
				}, {
					patch: true
				});

				bevy.set('members', members);

				break;

			case BEVY.LEAVE:
				var bevy_id = payload.bevy_id;
				var email = payload.email || '';
				var alias_id = payload.alias_id || '';

				var bevy = this.bevies.get(bevy_id);
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
						if(_.isObject(member.aliasid)) {
							return member.aliasid._id == alias_id;
						} else {
							return member.aliasid == alias_id;
						}
					});
				}

				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.aliasid))
						member.aliasid = member.aliasid._id;
					return member;
				});

				// save to server
				bevy.save({
					members: unpopulated_members
				}, {
					patch: true
				});

				bevy.set('members', members);

				this.trigger(BEVY.CHANGE_ALL);

				//console.log('leave', members);
				break;

			case BEVY.SWITCH:
				var bevy_id = payload.bevy_id;

				if(!bevy_id) {
					if(this.bevies.models.length < 1) {
						// no more bevies
						this.bevies._meta.active = null;
					} else {
						// set to the first one
						var first_id = this.bevies.models[0].id;
						this.bevies._meta.active = first_id;
					}
				} else {
					this.bevies._meta.active = bevy_id;
				}

				this.trigger(BEVY.CHANGE_ALL);

				break;

			case BEVY.INVITE:
				var bevy = payload.bevy;
				var alias = payload.alias;
				var members = payload.members;

				//console.log(bevy, members);

				// create notification
				// which sends email
				$.post(
					constants.apiurl + '/notifications',
					{
						event: 'invite:email',
						members: members,
						bevy: bevy,
						alias: alias
					},
					function(data) {
						//console.log(data);
					}
				).fail(function(jqXHR) {
					var response = jqXHR.responseJSON;
					//console.log(response);
				}.bind(this));

				break;

			case BEVY.ADD_USER:
				var bevy_id = payload.bevy_id;
				var alias = payload.alias;
				var email = payload.email;

				var bevy = this.bevies.get(bevy_id);
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
					invited_user = {
						email: email
					}
					members.push(invited_user);
				}

				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.aliasid))
						member.aliasid = member.aliasid._id;
					return member;
				});

				console.log(unpopulated_members);

				// save changes
				bevy.save({
					members: unpopulated_members
				}, {
					patch: true
				});

				// simulate population
				members[members.indexOf(invited_user)].aliasid = alias;
				bevy.set('members', members);

				//this.trigger(BEVY.CHANGE_ALL);
				//console.log(bevy.toJSON());

				break;
		}
	},

	getAll: function() {
		return this.bevies.toJSON();
	},

	getActive: function() {
		return (this.bevies._meta.active == null)
		? {}
		: this.bevies.get(this.bevies._meta.active);
	}
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

module.exports = BevyStore;
