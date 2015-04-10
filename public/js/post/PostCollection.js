/**
 * PostCollection.js
 *
 * post backbone collection
 * really just a fancy array with some CRUD functions
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');

var Post = require('./PostModel');
var constants = require('./../constants');

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Post,

	url: function() {
		return (_.isEmpty(this._meta.bevy))
		? constants.apiurl + '/posts'
		: constants.apiurl + '/bevies/' + this._meta.bevy.id + '/posts'
	},

	_meta: {
		bevy: null,
		sort: {
			by: 'top',
			direction: 'asc'
		}
	}
});
