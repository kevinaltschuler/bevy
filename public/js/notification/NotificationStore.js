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

var ChatStore = require('./../chat/ChatStore');
var PostActions = require('./../post/PostActions');

// inherit event class first
// VERY IMPORTANT, as the PostContainer view binds functions
// to this store's events
var NotificationStore = _.extend({}, Backbone.Events);

var user = window.bootstrap.user;

// now add some custom functions
_.extend(NotificationStore, {

  notifications: new Notifications,
  unread: 0,

  // handle calls from the dispatcher
  handleDispatch(payload) {
    switch(payload.actionType) {

      case APP.LOAD:
          this.notifications.fetch({
            success: function(collection, response, options) {
              this.trigger(NOTIFICATION.CHANGE_ALL);
            }.bind(this)
          });
          this.unread = this.notifications.filter(function(notification){ return notification.read == false; })
            .length; // count all notifications that are unread
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
        notification.save({read: true}, {patch: true});
        this.trigger(NOTIFICATION.CHANGE_ALL);
        break;
    }
  },

  getAll() {
    return (this.notifications.models.length <= 0)
    ? []
    : this.notifications.toJSON();
  }

});

NotificationStore.notifications.on('add', function(notification) {
  switch(notification.get('event')) {
    case 'post:create':
    case 'post:reply':
    case 'post:commentedon':
      // reload posts to get the latest
      //PostActions.fetch(notification.get('data').bevy_id);
      break;
  }
});

if(!_.isEmpty(window.bootstrap.user)) {
  var io = require('socket.io-client');
  var socket = io(constants.siteurl);
  socket.on('connect', function() {
    console.log('client connected');
    socket.emit('set_user_id', window.bootstrap.user._id);
  });
  socket.on('kitty cats', function(data) {
    console.log(data);
  });
  socket.on('chat:' + window.bootstrap.user._id, function(message) {
    message = JSON.parse(message);
    console.log('got message', message);
    if(message.author._id == window.bootstrap.user._id) return;

    var audio = document.createElement("audio");
    audio.src = "/audio/notification.mp3";
    audio.play();

    ChatStore.addMessage(message);
  });
  socket.on('notification:' + window.bootstrap.user._id, function(notification) {
    console.log('got notification', notification);
    NotificationStore.notifications.add(notification);
    NotificationStore.trigger(NOTIFICATION.CHANGE_ALL);
  });
}

Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));

module.exports = NotificationStore;
