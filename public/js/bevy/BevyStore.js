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
var async = require('async');

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

//var ChatStore = require('./../chat/ChatStore');

var user = window.bootstrap.user;

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var BevyStore = _.extend({}, Backbone.Events);

// now add some custom functions
_.extend(BevyStore, {

	myBevies: new Bevies,
	active: new Bevy,
	publicBevies: new Bevies,
	superBevy: new Bevy,
	subBevies: new Bevies,

	// handle calls from the dispatcher
	// these are created from BevyActions.js
	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case APP.LOAD:

				//var myBevies = window.bootstrap.myBevies || [];

				//this.myBevies.reset([]);
				this.myBevies.fetch({
					reset: true,
					success: function(collection, response, options) {
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				//load public bevies
				$.ajax({
					method: 'GET',
					url: constants.apiurl + '/bevies',
					success: function(data) {
						//console.log('success: ', data);
						this.publicBevies.reset(data);
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				//this.trigger(BEVY.CHANGE_ALL);

				break;

			case BEVY.CREATE:
				var name = payload.name;
				var description = payload.description;
				var image_url = payload.image_url;
				var user = window.bootstrap.user;
				var members = [];
				var parent = payload.parent;

				// add yerself
				members.push({
					email: user.email,
					user: (_.isEmpty(user)) ? null : user._id,
					role: 'admin'
				});

				var newBevy = this.myBevies.add({
					name: name,
					description: description,
					members: members,
					image_url: image_url,
					parent: parent
				});

				newBevy.save(null, {
					success: function(model, response, options) {
						// success
						newBevy.set('_id', model.id);
						newBevy.set('members', model.get('members'));

						this.publicBevies.add(model);

						// update posts
						if(parent == undefined) {
							// switch to bevy
							router.navigate('/b/' + model.id, { trigger: true });
						}
						else {
							// switch to bevy
							router.navigate('/b/' + parent + '/' + model.id, { trigger: true });
						}

						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.DESTROY:
				var id = payload.id;
				var bevy = this.myBevies.get(id);
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

				var bevy = this.myBevies.get(bevy_id);

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
				var bevy = this.myBevies.get(bevy_id);
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
				var email = payload.email || null;
				var user_id = payload.user_id || null;

				var bevy = this.myBevies.get(bevy_id);
				var members = bevy.get('members');

				var memberIndex;
				var member = _.find(members, function($member, index) {
					if(email == $member.email) {
						memberIndex = index;
						return true;
					} else return false;
				});

				if(member == undefined || memberIndex == undefined) {
					break;
				}

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
				var bevy = this.myBevies.get(bevy_id);
				var members = bevy.get('members');

				var user = window.bootstrap.user;
				var user_id = user._id;
				var email = user.email;

				var member = _.find(members, function($member, index) {
					if(!$member.user) return false; // skip members who haven't joined yet
					return (email == $member.email || user_id == $member.user._id);
				});

				if(member == undefined) break;

				$.ajax({
					method: 'DELETE',
					url: constants.apiurl + '/bevies/' + bevy_id + '/members/' + member._id,
					success: function(response) {
						// ok, now remove the bevy from the local list
						this.myBevies.remove(bevy.id);
						// switch to frontpage
						window.location.reload();
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.SWITCH:
				var super_id = router.superBevy_id;
				var sub_id = router.subbevy_id;

				console.log(super_id, sub_id);
				async.parallel([
					function(callback) {
						// get super
						$.ajax({
							url: constants.apiurl + '/bevies/' + super_id,
							method: 'GET',
							success: function(bevy) {
								callback(null, bevy);
							}
						});
					},
					function(callback) {
						// get sub
						//if(!sub_id) callback(null, null);
						this.subBevies.url = constants.apiurl + '/bevies/' + super_id + '/subbevies';
						this.subBevies.fetch({
							reset: true,
							success: function(collection, response, options) {
								callback(null, collection.toJSON());
							}
						});
					}.bind(this)
				],
				function(err, results) {
					var superBevy = results[0];
					var subbevies = results[1];

					this.superBevy = superBevy;
					if(sub_id) {
						var sub = _.findWhere(subbevies, { _id: sub_id });
						if(sub == undefined) this.active = this.superBevy;
						else this.active = sub;
					} else {
						this.active = this.superBevy;
					}

					this.trigger(BEVY.CHANGE_ALL);
				}.bind(this));

				break;

			case BEVY.SWITCH_SUB:
				//console.log('caught sub');

				$.ajax({
					url: constants.apiurl + '/bevies/' + router.subbevy_id,
					method: 'GET',
					success: function(bevy) {
						this.active = bevy;
						//console.log('switched sub: ', bevy);
						//router.navigate('/b/' + this.superBevy._id + '/' + bevy._id, { trigger: true });
					}.bind(this),
					error: function(jqXHR) {
						router.navigate('404', { trigger: true });
					}.bind(this)
				});

				this.trigger(BEVY.CHANGE_ALL);
				break;

			case BEVY.SWITCH_SUPER:
				//console.log('caught super');

				//set superbevy
				$.ajax({
					url: constants.apiurl + '/bevies/' + router.superBevy_id,
					method: 'GET',
					success: function(bevy) {
						this.active = bevy;
						this.superBevy = bevy;
						//console.log('switched super: ', this.superBevy);
						//router.navigate('/b/' + bevy._id, { trigger: true });
					}.bind(this),
					error: function(jqXHR) {
						router.navigate('404', { trigger: true });
					}.bind(this)
				});

				//filter subbevies out of all bevies
				/*$.ajax({
					method: 'GET',
					url: constants.apiurl + '/bevies',
					success: function(data) {
						this.subBevies = _.filter(data, function(_bevy) { 
							return _bevy.parent == this.superBevy; 
						}.bind(this));
					}.bind(this)
				});*/
				this.subBevies.url = constants.apiurl + '/bevies/' + router.superBevy_id + '/subbevies';
				this.subBevies.fetch({
					reset: true,
					success: function(collection, response, options) {

					}.bind(this)
				});

				this.trigger(BEVY.CHANGE_ALL);
				break;

			case BEVY.INVITE:
				var bevy = payload.bevy;
				var user = payload.user;
				var emails = payload.members;
				var member_name = payload.member_name;

				var $bevy = this.myBevies.get(bevy._id);
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

				$.ajax({
					method: 'post',
					url: constants.apiurl + '/bevies/' + bevy_id + '/members/',
					data: {
						email: email,
						user: user_id
					},
					success: function(data) {
						var bevy = this.myBevies.get(bevy_id);
						bevy.set('members', data);
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.JOIN:
				var bevy_id = payload.bevy_id;
				var user = window.bootstrap.user;
				var email = payload.email;

				$.ajax({
					method: 'post',
					url: constants.apiurl + '/bevies/' + bevy_id + '/members/',
					data: {
						email: email,
						user: user._id
					},
					success: function(member) {
						this.myBevies.fetch({
							reset: true,
							success: function(collection, response, options) {
								// switch to new bevy
								this.trigger(BEVY.CHANGE_ALL);
								router.navigate('/b/' + bevy_id, { trigger: true });
							}.bind(this)
						});
					}.bind(this),
					error: function(message) {
						// do nothing
					}
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

	getMyBevies: function() {
		return (this.myBevies.models.length <= 0)
		? []
		: this.myBevies.toJSON();
	},

	getPublicBevies: function() {
		return (this.publicBevies.models.length <= 0)
		? []
		: this.publicBevies.toJSON();
	},

	getActive: function() {
		return this.active;
	},

	getBevy: function(bevy_id) {
		var bevy = this.myBevies.get(bevy_id);
		return (bevy)
		? bevy.toJSON()
		: {};
	},

	getSuperBevy: function() {
		return this.superBevy;
	},

	getSubBevies: function() {
		return this.subBevies.toJSON();
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

/*
var myBevies = window.bootstrap.myBevies || [];
BevyStore.myBevies.reset(myBevies);
BevyStore.myBevies.unshift({
	_id: '-1',
	name: 'Frontpage'
});
BevyStore.trigger(BEVY.CHANGE_ALL);
*/

BevyStore.myBevies.on('sync', function() {
	//console.log('synced');

	//BevyStore.trigger(BEVY.CHANGE_ALL);
});

module.exports = BevyStore;
