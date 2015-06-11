'use strict';

var Backbone = require('backbone');

var Messages = require('./MessageCollection');

var constants = require('./../constants');

var ThreadModel = Backbone.Model.extend({
	idAttribute: '_id',
	initialize: function() {
		this.messages = new Messages;
		this.messages.url = constants.apiurl + '/threads/' + this.id + '/messages';
	}
});

module.exports = ThreadModel;
