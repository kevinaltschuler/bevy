/**
 * AppActions.js
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var APP = require('./../constants').APP;

var AppActions = {

	load: function() {
		dispatch(APP.LOAD, {

		});
	}

};
module.exports = AppActions;
