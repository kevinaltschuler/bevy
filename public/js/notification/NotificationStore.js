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
        notification.save({read: true},{patch: true});
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
      PostActions.fetch(notification.get('data').bevy_id);
      break;
  }
});

// set up long poll
(function poll() {
  $.ajax({
    url: constants.apiurl + '/users/' + user._id + '/notifications/poll',
    dataType: 'json',
    complete: function(jqXHR) {
      var response = jqXHR.responseJSON;
      console.log(response);
      if(response == undefined) return poll();

      ChatStore.addMessage(response.data);
      var audio = document.createElement("audio");
      audio.src = "/audio/notification.mp3";

      switch(response.type) {
        case 'notification':
          NotificationStore.notifications.add(response.data);
          NotificationStore.trigger(NOTIFICATION.CHANGE_ALL);
          break;
        case 'message':
          audio.play();
          break;
      }
      poll();
    },
    timeout: 30000
  });
})();

Dispatcher.register(NotificationStore.handleDispatch.bind(NotificationStore));

module.exports = NotificationStore;
