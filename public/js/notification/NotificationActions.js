/**
 * NotificationActions.js
 *
 * @author albert
 */

'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var NOTIFICATION = require('./../constants').NOTIFICATION;

var NotificationActions = {
	dismiss: function(notification_id) {
		dispatch(NOTIFICATION.DISMISS, {
			notification_id: (notification_id == undefined) ? '0' : notification_id
		});
	}
};
module.exports = NotificationActions;
