/**
 * NotificationActions.js
 *
 * @author albert
 */

'use strict';

var dispatch = require('./../shared/helpers/dispatch');
var NOTIFICATION = require('./../constants').NOTIFICATION;

var NotificationActions = {
  dismiss(notification_id) {
    dispatch(NOTIFICATION.DISMISS, {
      notification_id: (notification_id == undefined) ? '0' : notification_id
    });
  },
  read(notification_id) {
    dispatch(NOTIFICATION.READ, {
      notification_id: (notification_id == undefined) ? '0' : notification_id
    });
  }
};

module.exports = NotificationActions;
