/**
 * AliasModel.js
 *
 * Backbone model for Aliases
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var constants = require('./../constants');

// backbone model
module.exports = Backbone.Model.extend({
	defaults: {

	},

	idAttribute: '_id',

	url: function() {
		return (this.id) ?
		   constants.apiurl + '/aliases/' + this.id
		 : constants.apiurl + '/aliases/';
	}

});
