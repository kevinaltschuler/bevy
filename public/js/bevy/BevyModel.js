/**
 * BevyModel.js
 *
 * Backbone model for Bevies
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
		, color: null
		, imageUrl: null
		, members: []
		, settings: {}
		, created: 0
		, updated: 0
	},

	idAttribute: '_id',

	url: function() {
		return (this.id) ?
		   constants.apiurl + '/bevies/' + this.id
		 : constants.apiurl + '/bevies/';
	}
});
