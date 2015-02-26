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

// backbone model
module.exports = Backbone.Model.extend({
	defaults: {
		  id: null
		, name: null
		, color: null
		, imageUrl: null
		, members: []
		, settings: {}
		, created: 0
		, updated: 0
	},

	url: function() {
		return (this.id) ? '/bevies/' + this.id : '/bevies/';
	}
});
