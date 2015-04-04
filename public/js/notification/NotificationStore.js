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

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var NotificationStore = _.extend({}, Backbone.Events);

var user = window.bootstrap.user;
var notifications = user.notifications;

// now add some custom functions
_.extend(NotificationStore, {
	// handle calls from the dispatcher
	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case NOTIFICATION.DISMISS:
				var id = payload.notification_id;
				//console.log('dismiss', id);

				// remove client-side
				notifications.forEach(function(notification, index) {
					if(notification._id == id) {
						notifications.splice(index, 1);
						this.trigger(NOTIFICATION.CHANGE_ALL);
					}
				}.bind(this));

				// send server request
				$.ajax({
					url: constants.apiurl + '/users/' + user._id + '/notifications/' + id,
					type: 'DELETE',
					success: function(response) {
						//console.log(response);
					}
				});

				break;
		}
	},

	getAll: function() {
		return notifications;
	}

});

setInterval(
	function() {
		$.ajax({
			method: 'GET',
			url: constants.apiurl + '/users/' + user._id + '/notifications/',
			success: function(data){
				user.notifications = data;
				NotificationStore.trigger(NOTIFICATION.CHANGE_ALL);
			},
			dataType: 'json'
		});
	},
	30000
);


Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));
module.exports = NotificationStore;
