/**
 * notification/post.js
 * manages notifications for all things post related
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
subSock.subscribe(config.mq.events.NEW_POST);

// link pubsocket
var pubSock = mq.pubSock;

subSock.on('message', function(event, data) {
  event = event.toString();
  data = JSON.parse(data.toString());

  switch(event) {
    case config.mq.events.NEW_POST:
      createNewPostNotifications(data);
      break;
    default:
      break;
  }
});

var createNewPostNotifications = function(post) {
  var author = post.author;
  var board = post.board;

  var notifications = [];
  // get all users of the board
  User.find({ bevy: board.parent }, function(err, users) {
    if(err) {
      console.error(err);
      return;
    }
    // TODO check for board notification settings
    users.forEach(function(user) {
      //TODO: check user notification preferences here
      // dont send to author of post
      //if(user._id == author._id) return;

      // create notification object
      var notification = {
        _id: shortid.generate(),
        user: user._id,
        event: 'post:create',
        data: {
          author_name: author.displayName,
          author_image: author.image,
          board_id: board._id,
          board_name: board.name,
          post_title: post.title,
          post_id: post._id,
          post_created: post.created
        }
      };
      // push to arrays so it can be flushed to the database
      notifications.push(notification);

      // send out an event for any potential websockets to receive
      pubSock.send(['notification.' + user._id, JSON.stringify(notification)]);

      // send out separate event containing post
      // for livereloading via websockets
      pubSock.send(['newpost.' + user._id, JSON.stringify(post)]);
    });

    Notification.create(notifications, function(err, $notifications) {
      if(err) {
        console.error('new post notification create:', err);
        return;
      }
    });
  });
};
