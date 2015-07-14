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

		var bevy_id = (router.subbevy_id) ? router.subbevy_id : router.superBevy_id;
		
		if((bevy_id == -1) && (router.current == 'bevy'))
			return constants.apiurl + '/users/' + user._id + '/posts';

		if(router.current == 'search' && !_.isEmpty(router.search_query))
			return constants.apiurl + '/users/' + user._id + '/posts/search/' + router.search_query;

		return constants.apiurl + '/bevies/' + bevy_id + '/posts';
	},

	_meta: {
		sort: {
			by: 'top',
			direction: 'asc'
		}
	}
});
