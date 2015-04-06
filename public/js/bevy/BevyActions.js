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

	create: function(name, members) {
		dispatch(BEVY.CREATE, {
			  name: (name == undefined) ? '' : name
			, members: (members == undefined) ? [] : members
		});
	},

	destroy: function(id) {
		dispatch(BEVY.DESTROY, {
			id: (id == undefined) ? '0' : id
		});
	},

	leave: function(bevy_id, email, alias_id) {
		dispatch(BEVY.LEAVE, {
			  bevy_id: (bevy_id == undefined) ? '' : bevy_id
			, email: (email == undefined) ? '' : email
			, alias_id: (alias_id == undefined) ? '' : alias_id
		});
	},

	invite: function(bevy, alias, members) {
		dispatch(BEVY.INVITE, {
			  bevy: (bevy == undefined) ? {} : bevy
			, alias: (alias == undefined) ? {} : alias
			, members: (members == undefined) ? [] : members
		});
	},

	addUser: function(bevy_id, alias, email) {
		dispatch(BEVY.ADD_USER, {
			  bevy_id: (bevy_id == undefined) ? '0' : bevy_id
			, alias: (alias == undefined) ? {} : alias
			, email: (email == undefined) ? '' : email
		});
	},

	/**
	 * switch bevies and update posts accordingly
	 * @param  {int} id  id of bevy being switched to
	 */
	switchBevy: function(id) {
		dispatch(BEVY.SWITCH, {
			id: (id == undefined) ? '0' : id
		});
	}
};

module.exports = PostActions;
