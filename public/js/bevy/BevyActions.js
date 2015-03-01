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

	switchBevy: function(id) {
		dispatch(BEVY.SWITCH, {
			id: id
		});
	}
};

module.exports = PostActions;
