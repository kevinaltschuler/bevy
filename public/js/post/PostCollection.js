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

var user = window.bootstrap.user;

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Post,

	url: function() {

		if(this._meta.bevy_id == -1) return constants.apiurl + '/users/' + user._id + '/posts';

		return (_.isEmpty(this._meta.bevy_id))
		? constants.apiurl + '/posts'
		: constants.apiurl + '/bevies/' + this._meta.bevy_id + '/posts'
	},

	_meta: {
		bevy_id: null,
		sort: {
			by: 'top',
			direction: 'asc'
		}
	}
});
