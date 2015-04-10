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

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Bevy,
	//url: constants.apiurl + '/bevies',
	url: function() {
		return (_.isEmpty(this._meta.alias))
		? constants.apiurl + '/bevies'
		: constants.apiurl + '/aliases/' + this._meta.alias.id + '/bevies'
	},

	_meta: {
		active: null,
		alias: null
	}
});
