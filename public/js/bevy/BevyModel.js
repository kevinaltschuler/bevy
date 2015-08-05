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
var BevyModel = Backbone.Model.extend({

	defaults: {
		name: null,
		description: null,
		image_url: null,
		parent: null,
		admins: [],
		settings: {},
		created: 0,
		updated: 0,
		subs: 0,
	},

	idAttribute: '_id'
});

module.exports = BevyModel;
