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

	switch: function(alias_id) {
		dispatch(ALIAS.SWITCH, {
			id: (alias_id == undefined) ? '' : alias_id
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
