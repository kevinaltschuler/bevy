/**
 * AliasActions.js
 *
 * Action dispatcher for aliases
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var ALIAS = require('./../constants').ALIAS;

var AliasActions = {

	switch: function() {
		dispatch(ALIAS.SWITCH, {

		});
	},

	create: function() {
		dispatch(ALIAS.CREATE, {

		});
	},

	destroy: function() {
		dispatch(ALIAS.DESTROY, {

		});
	}
};
module.exports = AliasActions;
