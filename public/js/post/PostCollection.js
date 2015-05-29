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

var router = require('./../router');

var Post = require('./PostModel');
var constants = require('./../constants');

var user = window.bootstrap.user;

// backbone collection
module.exports = Backbone.Collection.extend({
	model: Post,

	sync: function(method, model, options) {
		Backbone.Collection.prototype.sync.apply(this, arguments); //continue using backbone's collection sync
	},

	url: function() {

		if(router.bevy_id == -1) return constants.apiurl + '/users/' + user._id + '/posts';

		return constants.apiurl + '/bevies/' + router.bevy_id + '/posts';
	},

	_meta: {
		sort: {
			by: 'top',
			direction: 'asc'
		}
	}
});
