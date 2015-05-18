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
var BEVY = constants.BEVY;
var POST = constants.POST;
var APP = constants.APP;

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

			case BEVY.CREATE:
				var name = payload.name;
				var description = payload.description;

				var user = window.bootstrap.user;

				var members = [];
				payload.members.forEach(function(email) {
					members.push({
						email: email
					});
				});

				// add yerself
				members.push({
					email: user.email,
					userid: user._id
				});

				//console.log(name, members);
				var newBevy = this.bevies.add({
					name: name,
					description: description,
					members: members
				});

				newBevy.save(null, {
					success: function(model, response, options) {
						// success
						newBevy.set('_id', model.id);
						// update posts
						BevyActions.switchBevy(model.id);
					}.bind(this)
				});

				break;

			case BEVY.DESTROY:
				var id = payload.id;
				var bevy = this.bevies.get(id);
				bevy.destroy({
					success: function(model, response) {
						// switch the active bevy
						var newBevy = this.bevies.models[0];
						if(!newBevy) {
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
				var image_url = payload.image_url;

				var bevy = this.bevies.get(bevy_id);

				if(!_.isEmpty(name)) bevy.set('name', name);
				if(!_.isEmpty(description)) bevy.set('description', description);
				if(!_.isEmpty(image_url)) bevy.set('image_url', image_url);

				bevy.save({
					name: name,
					description: description,
					image_url: image_url
				}, {
					patch: true
				});

				this.trigger(BEVY.CHANGE_ALL);
				this.trigger(BEVY.UPDATED_IMAGE);

				break;

			case BEVY.SET_NOTIFICATION_LEVEL:

				var bevy_id = payload.bevy_id;
				var user_id = payload.user_id;
				var level = payload.level;

				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				// set level
				members = _.map(members, function(member) {
					if(member.userid._id == user_id) {
						member.notificationLevel = level;
						return member;
					} else return member;
				});

				// unpopulate member aliasid
				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.userid))
						member.userid = member.userid._id;
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

				break;

			case BEVY.REMOVE_USER:
				var bevy_id = payload.bevy_id;
				var email = payload.email || '';
				var user_id = payload.user_id || '';

				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				if(_.isEmpty(user_id)) {
					// member is invited but has not joined
					// just cancel the invite
					members = _.reject(members, function(member) {
						return member.email == email;
					});
				} else {
					// remove the specific user
					members = _.reject(members, function(member) {
						if(_.isObject(member.userid)) {
							return member.userid._id == user_id;
						} else {
							return member.userid == user_id;
						}
					});
				}

				// need to create a deep clone

				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.userid))
						member.userid = member.userid._id;
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

				break;

			case BEVY.LEAVE:
				var bevy_id = payload.bevy_id;
				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				var user = window.bootstrap.user;

				// remove the specific user
				members = _.reject(members, function(member) {
					if(_.isObject(member.userid)) {
						return member.userid._id == user._id;
					} else {
						return member.userid == user._id;
					}
				});

				// need to create a deep clone
				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.userid))
						member.userid = member.userid._id;
					return member;
				});

				// save to server
				bevy.save({
					members: unpopulated_members
				}, {
					patch: true
				});
				// apply change
				bevy.set('members', members);

				// ok, now remove the bevy from the local list
				this.bevies.remove(bevy);
				if(this.bevies.models.length <= 0) {
					// no more bevies
					this.bevies._meta.active = null;
				} else {
					// switch to the first one
					this.bevies._meta.active = this.bevies.models[0].id;
				}

				this.trigger(BEVY.CHANGE_ALL);

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
				var user = payload.user;
				var members = payload.members;

				// create notification
				// which sends email
				$.post(
					constants.apiurl + '/notifications',
					{
						event: 'invite:email',
						members: members,
						bevy: bevy,
						user: user
					},
					function(data) {
					}
				).fail(function(jqXHR) {
					var response = jqXHR.responseJSON;
				}.bind(this));

				break;

			case BEVY.ADD_USER:
				var bevy_id = payload.bevy_id;
				var user = payload.user;
				var email = payload.email;

				var bevy = this.bevies.get(bevy_id);

				//console.log(bevy_id, bevy);
				var members = bevy.get('members');
				// user is being invited, add email
				var invited_user = {
					email: email
				}
				members.push(invited_user);

				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.userid))
						member.userid = member.userid._id;
					return member;
				});

				// save changes
				bevy.save({
					members: unpopulated_members
				}, {
					patch: true
				});

				// simulate population
				members[members.indexOf(invited_user)].userid = user;
				bevy.set('members', members);

				break;

			case BEVY.JOIN:
				var bevy_id = payload.bevy_id;
				var user = window.bootstrap.user;
				var email = payload.email;

				$.post(
					constants.apiurl + '/bevies/' + bevy_id + '/members/',
					{
						email: email,
						userid: user._id
					},
					function(data) {
						//console.log(data);
						this.bevies.fetch({
							reset: true,
							success: function(data) {
								// switch to new bevy
								this.bevies._meta.active = bevy_id;
								this.trigger(BEVY.CHANGE_ALL);
							}.bind(this)
						});
					}.bind(this)
				).fail(function(jqXHR) {
					var response = jqXHR.responseJSON;
					console.log(response);
				});

				// be optimistic so post store can do its thing
				this.bevies._meta.active = bevy_id;

				break;
		}
	},

	getAll: function() {
		return (this.bevies.models.length <= 0)
		? []
		: this.bevies.toJSON();
	},

	getActive: function() {
		return (this.bevies._meta.active == null)
		? {}
		: this.bevies.get(this.bevies._meta.active);
	}
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

BevyStore.bevies.on('sync', function() {
	//console.log('synced');

	BevyStore.trigger(BEVY.CHANGE_ALL);
});

module.exports = BevyStore;
