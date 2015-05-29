/**
 * BevyActions.js
 *
 * Action dispatcher for bevies
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var BEVY = require('./../constants').BEVY;

var PostActions = {

	fetch: function(alias) {
		dispatch(BEVY.FETCH, {
			alias: (alias == undefined) ? {} : alias
		});
	},

	create: function(name, description, image_url, members) {
		dispatch(BEVY.CREATE, {
			name: (name == undefined) ? '' : name,
			description: (description == undefined) ? '' : description,
			image_url: (image_url == undefined) ? '' : image_url,
			members: (members == undefined) ? [] : members
		});
	},

	destroy: function(id) {
		dispatch(BEVY.DESTROY, {
			id: (id == undefined) ? '0' : id
		});
	},

	update: function(bevy_id, name, description, image_url, settings) {
		dispatch(BEVY.UPDATE, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id,
			name: (name == undefined) ? null : name,
			description: (description == undefined) ? null : description,
			image_url: (image_url == undefined) ? null : image_url,
			settings: (settings == undefined) ? null : settings
		});
	},

	editMember: function(bevy_id, user_id, displayName, notificationLevel, role, image_url) {
		dispatch(BEVY.EDIT_MEMBER, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id,
			user_id: (user_id == undefined) ? '' : user_id,
			displayName: (displayName == undefined) ? '' : displayName,
			notificationLevel: (notificationLevel == undefined) ? 'all' : notificationLevel,
			role: (role == undefined) ? 'user' : role,
			image_url: (image_url == undefined) ? '' : image_url
		});
	},

	leave: function(bevy_id) {
		dispatch(BEVY.LEAVE, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id
		});
	},

	removeUser: function(bevy_id, email, user_id) {
		dispatch(BEVY.REMOVE_USER, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id,
			email: (email == undefined) ? '' : email,
			user_id: (user_id == undefined) ? '' : user_id
		});
	},

	invite: function(bevy, user, members) {
		dispatch(BEVY.INVITE, {
			bevy: (bevy == undefined) ? {} : bevy,
			user: (user == undefined) ? {} : user,
			members: (members == undefined) ? [] : members
		});
	},

	addUser: function(bevy_id, user_id, email) {
		dispatch(BEVY.ADD_USER, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id,
			user_id: (user_id == undefined) ? '' : user_id,
			email: (email == undefined) ? '' : email
		});
	},

	join: function(bevy_id, user, email) {
		dispatch(BEVY.JOIN, {
			bevy_id: (bevy_id == undefined) ? '0' : bevy_id,
			user: (user == undefined) ? {} : user,
			email: (email == undefined) ? '' : email
		});
	},

	requestJoin: function(bevy_id, user) {
		dispatch(BEVY.REQUEST_JOIN, {
			bevy: (bevy_id == undefined) ? {} : bevy_id,
			user: (user == undefined) ? {} : user
		});
	},

	/**
	 * switch bevies and update posts accordingly
	 * @param  {int} id  id of bevy being switched to
	 */
	switchBevy: function(bevy_id) {
		dispatch(BEVY.SWITCH, {
			bevy_id: (bevy_id == undefined) ? null : bevy_id
		});
	}
};

module.exports = PostActions;
