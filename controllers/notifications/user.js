/**
 * notifications/user.js
 * manages notifications for all things user related
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var config = require('./../../config');
var shortid = require('shortid');
var mq = require('./../../mq');
var zmq = require('zmq');

var User = require('./../../models/User');
var Post = require('./../../models/Post');
var Bevy = require('./../../models/Bevy');
var Board = require('./../../models/Board');
var Notification = require('./../../models/Notification');

// configure subscriber socket
var subSock = zmq.socket('sub');
subSock.connect('tcp://127.0.0.1:4000');
subSock.subscribe(config.mq.events.NEW_USER);

// link pubsocket
var pubSock = mq.pubSock;

subSock.on('message', function(event, data) {
  event = event.toString();
  data = JSON.parse(data.toString());

  switch(event) {
    case config.mq.events.NEW_USER:
      createNewUserNotifications(data);
      break;
    default:
      break;
  }
});

// notification that lets bevy members know that a new user
// has joined their bevy
var createNewUserNotifications = function(user) {
  var notifications = [];

  User.find({ bevy: user.bevy }, function(err, users) {
    if(err) {
      console.error(err);
      return;
    }
    // for each member of the bevy
    users.forEach(function($user) {
      // create notification object
      var notification = {
        _id: shortid.generate(),
        user: $user._id,
        event: 'user:new',
        data: user
      };
      notifications.push(notification);

      // send out to websockets for active users to receive immediately
      pubSock.send(['notification.' + $user._id, JSON.stringify(notification)]);
    });

    // flush to db
    Notification.create(notifications, function(err, $notifications) {
      if(err) {
        console.error('new user notification create:', err);
        return;
      }
    });
  });
};
