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
var Alias = require('./AliasModel');
var constants = require('./../constants');

// backbone collection
module.exports = Backbone.Collection.extend({
	  model: Alias
	, url: constants.apiurl + '/aliases'
	, _meta: {

	}
});
