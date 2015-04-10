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

	create: function(name, description, members, alias_id) {
		dispatch(BEVY.CREATE, {
			name: (name == undefined) ? '' : name,
			description: (description == undefined) ? '' : description,
			members: (members == undefined) ? [] : members,
			alias_id: (alias_id == undefined) ? '' : alias_id
		});
	},

	destroy: function(id) {
		dispatch(BEVY.DESTROY, {
			id: (id == undefined) ? '0' : id
		});
	},

	update: function(bevy_id, name, description) {
		dispatch(BEVY.UPDATE, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id,
			name: (name == undefined) ? '' : name,
			description: (description == undefined) ? '' : description
		});
	},

	setNotificationLevel: function(bevy_id, alias_id, level) {
		dispatch(BEVY.SET_NOTIFICATION_LEVEL, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id,
			alias_id: (alias_id == undefined) ? '' : alias_id,
			level: (level == undefined) ? 'never' : level
		});
	},

	leave: function(bevy_id, email, alias_id) {
		dispatch(BEVY.LEAVE, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id,
			email: (email == undefined) ? '' : email,
			alias_id: (alias_id == undefined) ? '' : alias_id
		});
	},

	invite: function(bevy, alias, members) {
		dispatch(BEVY.INVITE, {
			bevy: (bevy == undefined) ? {} : bevy,
			alias: (alias == undefined) ? {} : alias,
			members: (members == undefined) ? [] : members
		});
	},

	addUser: function(bevy_id, alias, email) {
		dispatch(BEVY.ADD_USER, {
			bevy_id: (bevy_id == undefined) ? '0' : bevy_id,
			alias: (alias == undefined) ? {} : alias,
			email: (email == undefined) ? '' : email
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
