/**
 * controllers/notifications/comment.js
 * handle notification creation for comments
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var config = require('./../../config');
var zmq = require('zmq');
var mq = require('./../../mq');
var shortid = require('shortid');
var async = require('async');

var User = require('./../../models/User');
var Post = require('./../../models/Post');
var Bevy = require('./../../models/Bevy');
var Board = require('./../../models/Board');
var Notification = require('./../../models/Notification');
var Comment = require('./../../models/Comment');

// configure subscriber socket
var subSock = zmq.socket('sub');
subSock.connect('tcp://127.0.0.1:4000');
subSock.subscribe(config.mq.events.NEW_COMMENT);

var pubSock = mq.pubSock;

subSock.on('message', function(event, data) {
  event = event.toString();
  data = JSON.parse(data.toString());

  switch(event) {
    case config.mq.events.NEW_COMMENT:
      createNewCommentNotifications(data);
      break;
    default:
      break;
  }
});

var createNewCommentNotifications = function(comment) {
  var post = comment.postId;
  var author = comment.author;

  async.waterfall([
    function(done) {
      var notifications = [];
      Board.findOne({ _id: post.board }, function(err, board) {
        if(err) return done('Board not found');
        // dont send reply notification to self
        // skip this part and pass empty array to next middleware
        if(author._id == post.author) return done(null, notifications);

        notifications.push({
          _id: shortid.generate(),
          user: post.author,
          event: 'post:reply',
          data: {
            author_name: author.displayName,
            author_image: author.image_url,
            post_title: post.title,
            board_name: board.name,
            board_id: board._id,
            post_id: post._id,
            comment_id: comment._id,
            comment_created: comment.created,
            comment_body: comment.body
          }
        });
        done(null, notifications);
      });
    },
    function(notifications, done) {
      Comment.findOne({ _id: comment.parentId }, function(err, $comment) {
        if(err) return done(err);
        // dont send reply notification to self
        // skip this part and pass notifications to next middleware
        if(author._id == post.author) return done(null, notifications);
        // parent comment not found
        // skip this part and pass notifications to next middleware
        if(_.isEmpty($comment)) return done(null, notifications);

        notifications.push({
          _id: shortid.generate(),
          user: $comment.author,
          event: 'comment:reply', //TODO: change to comment:reply
          data: {
            author_name: author.displayName,
            author_image: author.image_url,
            post_title: post.title,
            board_name: board.name,
            board_id: board._id,
            comment_id: comment._id,
            comment_created: comment.created,
            comment_body: comment.body
          }
        });

        return done(null, notifications);
      });
    }
  ], function(err, notifications) {
    if(err) {
      console.error(err);
      return;
    }
    for(var i in notifications) {
      var notification = notifications[i];
      // send out an event for any potential websockets to receive
      pubSock.send(['notification.' + notification.user, JSON.stringify(notification)]);
      // send out separate event containing post
      // for livereloading via websockets
      pubSock.send(['newcomment.' + notification.user, JSON.stringify(comment)]);
    }


    Notification.create(notifications, function(err, $notifications) {
      if(err) {
        console.error('new post notification create:', err);
        return;
      }
    });
  });
};
