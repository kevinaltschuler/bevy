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

	create: function(name) {
		dispatch(BEVY.CREATE, {
			name: (name == undefined) ? '' : name
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
