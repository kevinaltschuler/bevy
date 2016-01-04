/**
 * NotificationCollection.js
 * @author albert
 * @flow
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var NotificationModel = require('./NotificationModel');

var constants = require('./../constants');
var user = window.bootstrap.user;

var NotificationCollection = Backbone.Collection.extend({
  model: NotificationModel,
  comparator: function(notification) {
    var date = Date.parse(notification.get('created'));
    return -date;
  },
  url() {
    return constants.apiurl + '/users/' + user._id + '/notifications/';
  }
});

module.exports = NotificationCollection;
