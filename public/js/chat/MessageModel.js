'use strict';

var Backbone = require('backbone');

var MessageModel = Backbone.Model.extend({
	defaults: {
		_id: null,
		body: '',
		created: Date.now()
	},
	idAttribute: '_id'
});

module.exports = MessageModel;
