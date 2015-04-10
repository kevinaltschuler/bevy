/**
 * AliasCollection.js
 *
 * Backbone collection for Aliases
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Alias = require('./AliasModel');
var constants = require('./../constants');

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Alias,
	url: function() {
		return (_.isEmpty(this._meta.userid))
		? constants.apiurl + '/aliases'
		: constants.apiurl + '/users/' + this._meta.userid + '/aliases'
	},
	_meta: {
		userid: null,
		active: null
	}
});
