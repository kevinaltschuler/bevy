/**
 * BevyCollection.js
 *
 * Backbone collection for bevies
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Bevy = require('./BevyModel');
var constants = require('./../constants');

var user = window.bootstrap.user;

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Bevy,
	url: function() {
		return constants.apiurl + '/users/' + user._id + '/bevies';
	},
	_meta: {
		active: null
	},
	filter: 'top'
});
