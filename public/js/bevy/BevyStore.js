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
	searchQuery: '',
	searchList: new Bevies,

	// handle calls from the dispatcher
	// these are created from BevyActions.js
	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case APP.LOAD:
				var user = window.bootstrap.user;

				this.publicBevies.url = constants.apiurl + '/bevies';

				//load public bevies
				this.publicBevies.fetch({
					success: function(collection, response, options) {
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				if(_.isEmpty(user)) {
					break;
				}
				this.myBevies.reset(window.bootstrap.myBevies);

				break;

			case BEVY.CREATE:
				var name = payload.name;
				var description = payload.description;
				var image_url = payload.image_url;
				var user = window.bootstrap.user;
				var parent = payload.parent;

				var newBevy = this.myBevies.add({
					name: name,
					description: description,
					members: members,
					image_url: image_url,
					parent: parent,
					admins: [user._id]
				});

				console.log(newBevy);

				newBevy.save(null, {
					success: function(model, response, options) {
						// success
						newBevy.set('_id', model.id);

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

						var bevy_ids = this.myBevies.pluck('_id');
						bevy_ids.push(model.id);

						$.ajax({
							method: 'PATCH',
							url: constants.apiurl + '/users/' + user._id,
							data: {
								bevies: bevy_ids
							},
							success: function($user) {
								this.trigger(BEVY.CHANGE_ALL);
							}.bind(this)
						});
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


				break;

			case BEVY.LEAVE:
				var bevy_id = payload.bevy_id;
				var bevy = this.myBevies.get(bevy_id);
				var user = window.bootstrap.user;
				var user_id = user._id;

				// if not joined
				if(this.myBevies.get(bevy_id) == undefined) break;

				if(bevy == undefined) {
					// not found
					break;
				}
				var bevies = _.reject(user.bevies, function(bevy) {
					return bevy_id == ((_.isObject(bevy)) ? bevy._id : bevy);
				});

				this.myBevies.remove(bevy_id);

				user.bevies = bevies;

				this.trigger(BEVY.CHANGE_ALL);

				//if(bevy == undefined) break;

				/*var members = bevy.get('members');

				var user = window.bootstrap.user;
				var user_id = user._id;
				var email = user.email;*/

				/*var member = _.find(members, function($member, index) {
					if(!$member.user) return false; // skip members who haven't joined yet
					return (email == $member.email || user_id == $member.user._id);
				});

				if(member == undefined) break;*/

				$.ajax({
					method: 'PATCH',
					url: constants.apiurl + '/users/' + user_id,
					data: {
						bevies: _.pluck(bevies, '_id')
					},
					success: function($user) {
						// ok, now remove the bevy from the local list
						//user.bevies = $user.bevies
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.JOIN:
				var bevy_id = payload.bevy_id;
				var user = window.bootstrap.user;

				// if already joined, break
				if(this.myBevies.get(bevy_id) != undefined) break;

				$.ajax({
					method: 'GET',
					url: constants.apiurl + '/bevies/' + bevy_id,
					success: function(bevy) {
						this.myBevies.add(bevy);
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				var bevy_ids = this.myBevies.pluck('_id');
				bevy_ids.push(bevy_id);

				this.trigger(BEVY.CHANGE_ALL);

				$.ajax({
					method: 'PATCH',
					url: constants.apiurl + '/users/' + user._id,
					data: {
						bevies: bevy_ids
					},
					success: function($user) {
						console.log('joined');
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case BEVY.SWITCH:
				var super_id = payload.super_id;
				var sub_id = payload.sub_id;

				//console.log(super_id, sub_id);
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
					this.trigger(BEVY.SWITCHED);
					this.trigger(BEVY.CHANGE_ALL);
				}.bind(this));

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
						emails: emails,
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
					url: constants.apiurl + '/users/' + user_id + '/bevies/',
					data: {
						bevies: [bevy_id]
					},
					success: function(data) {
						var bevy = this.myBevies.get(bevy_id);
						bevy.set('members', data);
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
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
			case BEVY.SORT:
				var filter = payload.filter;
				
				var collection = (!_.isEmpty(this.searchQuery)) ? this.searchList : this.publicBevies;
				collection.filter == filter;
				switch(filter) {
					case 'top':
						collection.comparator = this.sortByTop;
						break;
					case 'bottom':
						collection.comparator = this.sortByBottom;
						break;
					case 'new':
						collection.comparator = this.sortByNew;
						break;
					case 'old':
						collection.comparator = this.sortByOld;
						break;
				}

				this.trigger(BEVY.CHANGE_ALL);
				break;
			case BEVY.CHANGE_COLLECTION:
				this.collection = payload.collection;
				this.trigger(BEVY.CHANGE_ALL);
				break;
			case BEVY.SEARCH:
				var query = payload.query;
				this.searchQuery = query;
				this.searchList.url = constants.apiurl + '/bevies/search/' + query;
				this.searchList.fetch({
					success: function(collection, response, options) {
						this.trigger(BEVY.CHANGE_ALL);
					}.bind(this)
				});
				break;
		}
	},

	getMyBevies: function() {
		return this.myBevies.toJSON();
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
	},

	getSearchList: function() {
		return this.searchList;
	},

	getSearchQuery: function() {
		return this.searchQuery;
	},

	getCollection: function() {
		return this.collection;
	},

	sortByTop: function(bevy) {
		var subs = bevy.subs;
		return -subs;
	},
	sortByBottom: function(bevy) {
		var subs = bevy.subs;
		return subs;
	},
	sortByNew: function(bevy) {
		var date = Date.parse(bevy.get('created'));
		return -date;
	},
	sortByOld: function(bevy) {
		var date = Date.parse(bevy.get('created'));
		console.log(date);
		return date;
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
