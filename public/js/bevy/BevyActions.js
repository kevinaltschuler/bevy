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

	create: function(name, description, image_url, members, parent) {

		dispatch(BEVY.CREATE, {
			name: (name == undefined) ? '' : name,
			description: (description == undefined) ? '' : description,
			image_url: (image_url == undefined) ? '' : image_url,
			members: (members == undefined) ? [] : members,
			parent: (parent == undefined) ? null : parent
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

	leave: function(bevy_id) {
		dispatch(BEVY.LEAVE, {
			bevy_id: (bevy_id == undefined) ? '' : bevy_id
		});
	},


	join: function(bevy_id, user, email) {
		dispatch(BEVY.JOIN, {
			bevy_id: (bevy_id == undefined) ? '0' : bevy_id,
			user: (user == undefined) ? {} : user,
			email: (email == undefined) ? '' : email
		});
	},

	switchBevy: function(bevy_id) {
		dispatch(BEVY.SWITCH, {
			bevy_id: bevy_id || -1
		});
	},

	filterBevies: function(filter) {
		dispatch(BEVY.SORT, {
			filter: (filter == undefined) ? null : filter
		});
	},

	search: function(query) {
		dispatch(BEVY.SEARCH, {
			query: (query == undefined) ? null : query
		});
	},
};

module.exports = PostActions;
