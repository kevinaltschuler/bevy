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

var router = require('./../router');

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
					reset: true,
					success: function(collection, response, options) {

						// add frontpage - and put it at the top of the list
						this.bevies.unshift({
							_id: '-1',
							name: 'Frontpage'
						});

						// propagate change
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.CREATE:
				var name = payload.name;
				var description = payload.description;
				var image_url = payload.image_url;

				var user = window.bootstrap.user;

				var members = [];

				// add yerself
				members.push({
					email: user.email,
					user: user._id,
					role: 'admin'
				});

				var newBevy = this.bevies.add({
					name: name,
					description: description,
					members: members,
					image_url: image_url
				});

				newBevy.save(null, {
					success: function(model, response, options) {
						// success
						newBevy.set('_id', model.id);

						// switch to bevy
						router.navigate('/b/' + model.id, { trigger: true });

						// update posts
						BevyActions.switchBevy();

						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.DESTROY:
				var id = payload.id;
				var bevy = this.bevies.get(id);
				bevy.destroy({
					success: function(model, response) {
						// switch to the frontpage
						router.navigate('/b/frontpage', { trigger: true });

						// update posts
						BevyActions.switchBevy();

						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.UPDATE:
				var bevy_id = payload.bevy_id;

				var bevy = this.bevies.get(bevy_id);

				var name = payload.name || bevy.get('name');
				var description = payload.description || bevy.get('description');
				var image_url = payload.image_url || bevy.get('image_url');
				var settings = payload.settings || bevy.get('settings');

				bevy.set({
					name: name,
					description: description,
					image_url: image_url,
					settings: settings
				});

				bevy.save({
					name: name,
					description: description,
					image_url: image_url,
					settings: settings
				}, {
					patch: true
				});

				this.trigger(BEVY.CHANGE_ALL);
				this.trigger(BEVY.UPDATED_IMAGE);

				break;

			case BEVY.EDIT_MEMBER:
				var bevy_id = payload.bevy_id;

				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				var user_id = payload.user_id ;
				var displayName = payload.displayName;
				var notificationLevel = payload.notificationLevel;
				var role = payload.role;
				var image_url = payload.image_url;

				members = _.map(members, function(member) {
					if(!_.isObject(member.user)) return member;
					if(member.user._id == user_id) {
						member.displayName = displayName;
						member.notificationLevel = notificationLevel;
						member.role = role;
						member.image_url = image_url;
						return member;
					} else return member;
				});

				// unpopulate member aliasid
				var unpopulated_members = _.map(members, function(member) {
					if(_.isObject(member.user))
						member.user = member.user._id;
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
						return (member.email == email && !_.isObject(member.user));
					});
				} else {
					// remove the specific user
					members = _.reject(members, function(member) {
						if(_.isObject(member.user)) {
							return member.user._id == user_id;
						} else {
							return member.user == user_id;
						}
					});
				}

				// need to create a deep clone
				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.user))
						member.user = member.user._id;
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
					if(_.isObject(member.user)) {
						return member.user._id == user._id;
					} else {
						return member.user == user._id;
					}
				});

				// need to create a deep clone
				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.user))
						member.user = member.user._id;
					return member;
				});

				// save to server
				bevy.save({
					members: unpopulated_members
				}, {
					patch: true,
					success: function(model, response, options) {
						BevyActions.switchBevy();
					}
				});
				// apply change
				bevy.set('members', members);

				// ok, now remove the bevy from the local list
				this.bevies.remove(bevy);
				// switch to frontpage
				router.navigate('/b/frontpage', { trigger: true });

				this.trigger(BEVY.CHANGE_ALL);

				break;

			case BEVY.SWITCH:
				this.trigger(BEVY.CHANGE_ALL);
				break;

			case BEVY.INVITE:
				var bevy = payload.bevy;
				var user = payload.user;
				var emails = payload.members;
				var member_name = payload.member_name;

				var $bevy = this.bevies.get(bevy._id);
				var members = $bevy.get('members');

				emails.forEach(function(email) {
					members.push({
						email: email
					});
				});

				var unpopulated_members = _.map(members, function(member, key) {
					if(_.isObject(member.user))
						member.user = member.user._id;
					return member;
				});

				// save changes
				$bevy.save({
					members: unpopulated_members
				}, {
					patch: true
				});

				$bevy.set('members', members);

				var inviter_name = (member_name && bevy.settings.anonymise_users)
				? member_name
				: user.displayName;

				// create notification
				// which sends email
				$.post(
					constants.apiurl + '/notifications',
					{
						event: 'invite:email',
						members: emails,
						bevy_id: bevy._id,
						bevy_name: bevy.name,
						bevy_img: bevy.image_url,
						inviter_name: inviter_name
					}
				);

				this.trigger(BEVY.CHANGE_ALL);

				break;

			case BEVY.ADD_USER:
				var bevy_id = payload.bevy_id;
				var user_id = payload.user_id;
				var email = payload.email;

				$.post(
					constants.apiurl + '/bevies/' + bevy_id + '/members/',
					{
						email: email,
						user: user_id
					},
					function(data) {
						var bevy = this.bevies.get(bevy_id);
						bevy.set('members', data);
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				);

				break;

			case BEVY.JOIN:
				var bevy_id = payload.bevy_id;
				var user = window.bootstrap.user;
				var email = payload.email;

				$.post(
					constants.apiurl + '/bevies/' + bevy_id + '/members/',
					{
						email: email,
						user: user._id
					},
					function(data) {
						//console.log(data);
						this.bevies.fetch({
							reset: true,
							success: function(data) {
								// add frontpage - and put it at the top of the list
								this.bevies.unshift({
									_id: '-1',
									name: 'Frontpage'
								});

								// switch to new bevy
								router.navigate('/b/' + bevy_id, { trigger: true });
								this.trigger(BEVY.CHANGE_ALL);
							}.bind(this)
						});
					}.bind(this)
				).fail(function(jqXHR) {
					var response = jqXHR.responseJSON;
					console.log(response);
				});

				break;

			case BEVY.REQUEST_JOIN:
				var bevy = payload.bevy;
				var $user = payload.user;

				var stripped_members = _.map(bevy.members, function(member) {
					var new_member = {};
					new_member.role = member.role;
					if(_.isObject(member.user))
						new_member.user = member.user._id;
					return new_member;
				});

				$.post(
					constants.apiurl + '/notifications',
					{
						event: 'bevy:requestjoin',
						bevy_id: bevy._id,
						bevy_members: stripped_members,
						bevy_name: bevy.name,
						user_id: $user._id,
						user_name: $user.displayName,
						user_image: $user.image_url,
						user_email: $user.email
					}
				);

				break;
		}
	},

	getAll: function() {
		return (this.bevies.models.length <= 0)
		? []
		: this.bevies.toJSON();
	},

	getActive: function() {
		var bevy = this.bevies.get(router.bevy_id)
		return (bevy)
		? bevy.toJSON()
		: {};
	},

	getActiveMember: function() {
		var bevy = this.getActive();
		if(_.isEmpty(bevy)) return {};
		var members = bevy.members;
		var member = _.find(members, function(m) {
			if(!m.user) return false;
			if(!_.isObject(m.user)) return m.user == user._id;
			return m.user._id == user._id;
		});
		return (member == undefined)
		? {}
		: member;
	},

	getMembers: function() {
		var bevy = this.getActive();
		if(_.isEmpty(bevy)) return [];
		var members = bevy.members;
		return members;
	}
});

var dispatchToken = Dispatcher.register(BevyStore.handleDispatch.bind(BevyStore));
BevyStore.dispatchToken = dispatchToken;

BevyStore.bevies.on('sync', function() {
	//console.log('synced');

	BevyStore.trigger(BEVY.CHANGE_ALL);
});

module.exports = BevyStore;
