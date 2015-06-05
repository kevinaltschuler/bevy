'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var NotificationModel = require('./NotificationModel');

var constants = require('./../constants');
var user = window.bootstrap.user;

var NotificationCollection = Backbone.Collection.extend({
	model: NotificationModel,
	url: function() {
		return constants.apiurl + '/users/' + user._id + '/notifications/';
	}
});

module.exports = NotificationCollection;
