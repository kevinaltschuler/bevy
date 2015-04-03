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
		  name: null
		, photos: []
		, updated: 0
		, created: 0
	},

	idAttribute: '_id'

});
