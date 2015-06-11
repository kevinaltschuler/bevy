'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var Message = require('./MessageModel');

var MessageCollection = Backbone.Collection.extend({
	model: Message
});

module.exports = MessageCollection;
