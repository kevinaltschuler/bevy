/**
 * permissions/notification.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var checkBackdoor = require('./backdoor');

var Notification = require('./../../models/Notification');

exports.isUserNotification = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var notification_id = req.params.notificationid;
  Notification.findOne({ _id: notification_id }, function(err, notification) {
    if(err) return next(err);
    if(_.isEmpty(notification)) return next({
      code: 404,
      message: 'Notification not found'
    });
    if(notification.user == req.user._id) return next();
    else return next({
      code: 403,
      message: 'Notification ' + notification._id + ' does not belong to user'
    });
  });
};
