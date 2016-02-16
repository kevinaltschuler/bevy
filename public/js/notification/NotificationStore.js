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
var Invites = require('./InviteCollection');

var PostStore = require('./../post/PostStore');
var PostActions = require('./../post/PostActions');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var NotificationStore = _.extend({}, Backbone.Events);

var user = window.bootstrap.user;

// now add some custom functions
_.extend(NotificationStore, {

  notifications: new Notifications,
  invites: new Invites,
  unread: 0,

  // handle calls from the dispatcher
  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.LOAD:
        this.notifications.fetch({
          success: function(collection, response, options) {
            // count all notifications that are unread
            this.unread = this.notifications.filter(function(notification) {
              return notification.read == false;
            }).length;
            this.notifications.sort();
            this.trigger(NOTIFICATION.CHANGE_ALL);
          }.bind(this)
        });
        this.invites.url = constants.apiurl + '/users/' + window.bootstrap.user._id + '/invites';
        this.invites.fetch({
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

      case NOTIFICATION.READ:
        var id = payload.notification_id;
        var notification = this.notifications.get(id);
        notification.read = true;
        this.unread -= 1;
        notification.url = constants.apiurl + '/notifications/' + notification.get('_id');
        notification.save({ read: true }, { patch: true });
        this.trigger(NOTIFICATION.CHANGE_ALL);
        break;
    }
  },

  getAll() {
    return this.notifications.toJSON();
  },

  getUserInvites() {
    return this.invites.toJSON();
  }
});

if(!_.isEmpty(window.bootstrap.user)) {
  var io = require('socket.io-client');
  var socket = io(constants.siteurl);
  var user_id = window.bootstrap.user._id;
  socket.on('connect', function() {
    console.log('client connected');
    socket.emit('set_user_id', user_id);
  });
  //socket.on('kitty cats', function(data) {
  //  console.log(data);
  //});

  socket.on('chat.' + user_id, function(message) {

  });
  socket.on('newpost.' + user_id, function(post) {
    if(_.isObject(post)) {
    } else {
      post = JSON.parse(post);
    }
    console.log('got new post', post._id);
    PostStore.addPost(post);
  });
  socket.on('newcomment.' + user_id, function(comment) {
    if(_.isObject(comment)) {
    } else {
      comment = JSON.parse(comment);
    }
    console.log('got new comment', comment._id);
    PostStore.addComment(comment);
  });
  socket.on('notification.' + user_id, function(notification) {
    if(_.isObject(notification)) {
    } else {
      notification = JSON.parse(notification);
    }
    console.log('got notification', notification);
    NotificationStore.notifications.add(notification);
    NotificationStore.notifications.sort();
    NotificationStore.trigger(NOTIFICATION.CHANGE_ALL);
  });
}

Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));

module.exports = NotificationStore;
