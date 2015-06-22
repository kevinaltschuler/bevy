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
var CONTACT = constants.CONTACT;
var CHAT = constants.CHAT;
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

				var bevies = window.bootstrap.bevies || [];
				this.bevies.reset(bevies);

				this.bevies.unshift({
					_id: '-1',
					name: 'Frontpage'
				});

				this.trigger(BEVY.CHANGE_ALL);

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
					user: (_.isEmpty(user)) ? null : user._id,
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
						newBevy.set('members', model.get('members'));

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
				// update more stuff
				this.trigger(POST.CHANGE_ALL);
				this.trigger(CHAT.CHANGE_ALL);
				this.trigger(CONTACT.CHANGE_ALL);

				break;

			case BEVY.EDIT_MEMBER:
				var bevy_id = payload.bevy_id;
				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				var user_id = payload.user_id;
				var displayName = payload.displayName;
				var notificationLevel = payload.notificationLevel;
				var role = payload.role;
				var image_url = payload.image_url;

				var memberIndex;
				var member = _.find(members, function($member, index) {
					if($member.user._id == user_id) {
						memberIndex = index;
						return true;
					} else return false;
				});

				$.ajax({
					method: 'PATCH',
					url: constants.apiurl + '/bevies/' + bevy_id + '/members/' + member._id,
					data: {
						displayName: displayName,
						notificationLevel: notificationLevel,
						role: role,
						image_url: image_url
					},
					success: function(response) {

					}
				});


				this.trigger(BEVY.CHANGE_ALL);

				break;

			case BEVY.REMOVE_USER:
				var bevy_id = payload.bevy_id;
				var email = payload.email || '';
				var user_id = payload.user_id || '';

				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				var memberIndex;
				var member = _.find(members, function($member, index) {
					if(email == $member.email || user_id == $member.user._id) {
						memberIndex = index;
						return true;
					} else return false;
				});

				if(member == undefined || memberIndex == undefined) break;

				$.ajax({
					method: 'DELETE',
					url: constants.apiurl + '/bevies/' + bevy_id + '/members/' + member._id
				});

				members.splice(memberIndex, 1);
				bevy.set('members', members);

				this.trigger(BEVY.CHANGE_ALL);

				break;

			case BEVY.LEAVE:
				var bevy_id = payload.bevy_id;
				var bevy = this.bevies.get(bevy_id);
				var members = bevy.get('members');

				var user = window.bootstrap.user;
				var user_id = user._id;
				var email = user.email;

				var member = _.find(members, function($member, index) {
					return (email == $member.email || user_id == $member.user._id);
				});

				if(member == undefined) break;

				$.ajax({
					method: 'DELETE',
					url: constants.apiurl + '/bevies/' + bevy_id + '/members/' + member._id,
					success: function(response) {
						// ok, now remove the bevy from the local list
						this.bevies.remove(bevy.id);
						// switch to frontpage
						router.navigate('/b/frontpage', { trigger: true });

						this.trigger(BEVY.CHANGE_ALL);
						this.trigger(CHAT.CHANGE_ALL);
					}.bind(this)
				});

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
					$.ajax({
						method: 'POST',
						url: constants.apiurl + '/bevies/' + bevy._id + '/members',
						data: {
							email: email
						}
					});
					members.push({
						email: email
					});
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
					function(member) {
						this.bevies.fetch({
							reset: true,
							success: function(collection, response, options) {
								console.log(collection);
								// add frontpage
								this.bevies.unshift({
									_id: '-1',
									name: 'Frontpage'
								});
								// switch to new bevy
								this.trigger(BEVY.CHANGE_ALL);
								this.trigger(CHAT.CHANGE_ALL);
								router.navigate('/b/' + bevy_id, { trigger: true });
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

				$.post(
					constants.apiurl + '/notifications',
					{
						event: 'bevy:requestjoin',
						bevy_id: bevy._id,
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

	getBevy: function(bevy_id) {
		var bevy = this.bevies.get(bevy_id);
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

	//BevyStore.trigger(BEVY.CHANGE_ALL);
});

module.exports = BevyStore;
