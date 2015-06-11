'use strict';

var Backbone = require('backbone');

var MessageModel = Backbone.Model.extend({
	idAttribute: '_id'
});

module.exports = MessageModel;
