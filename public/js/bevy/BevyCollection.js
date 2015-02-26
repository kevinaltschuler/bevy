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
var Bevy = require('./BevyModel');

// backbone collection
module.exports = Backbone.Collection.extend({
	  model: Bevy
	, url: '/bevies'
});
