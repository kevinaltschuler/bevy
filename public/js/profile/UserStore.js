'use strict';

// imports
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var constants = require('./../constants');
var USER = constants.USER;

var user = window.bootstrap.user;

var UserStore = _.extend({}, Backbone.Events);
// now add some custom functions
_.extend(UserStore, {

	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case USER.UPDATE:
				var image_url = payload.image_url;

				$.ajax(
					url: constants.apiurl + '/users/' + user._id,
					method: 'PATCH',
					data: {
						image_url: image_url
					},
					success: function(data) {

					}
				);

				break;
		}
	}
});

var dispatchToken = Dispatcher.register(UserStore.handleDispatch.bind(PostStore));
UserStore.dispatchToken = dispatchToken;

module.exports = UserStore;
