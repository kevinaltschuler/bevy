/**
 * NotificationStore.js
 *
 * @author albert
 */

'use strict';

// imports
var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');

var NOTIFICATION = require('./../constants').NOTIFICATION;
var APP = require('./../constants').APP;

var Notifications = require('./NotificationCollection');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var NotificationStore = _.extend({}, Backbone.Events);

var user = window.bootstrap.user;
var notifications = user.notifications;

// now add some custom functions
_.extend(NotificationStore, {

	notifications: new Notifications,

	// handle calls from the dispatcher
	handleDispatch: function(payload) {
		switch(payload.actionType) {

			case APP.LOAD:

				this.notifications.fetch({
					reset: true,
					success: function(collection, response, options) {
						this.trigger(NOTIFICATION.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case NOTIFICATION.DISMISS:
				var id = payload.notification_id;

				var notification = this.notifications.get(id);
				notification.destroy();

				this.trigger(NOTIFICATION.CHANGE_ALL);

				break;
		}
	},

	getAll: function() {
		return (this.notifications.models.length <= 0)
		? []
		: this.notifications.toJSON();
	}

});

// set up long poll
(function poll() {
	$.ajax({
		url: constants.apiurl + '/users/' + user._id + '/notifications/poll',
		dataType: 'json',
		success: function(data) {

			NotificationStore.notifications.add(data);

			NotificationStore.trigger(NOTIFICATION.CHANGE_ALL);
		},
		complete: poll,
		timeout: 30000
	});
})();


Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));
module.exports = NotificationStore;
