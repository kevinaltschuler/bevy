'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Messages = require('./MessageCollection');

var constants = require('./../constants');

var BevyStore = require('./../bevy/BevyStore');

var ThreadModel = Backbone.Model.extend({
	idAttribute: '_id',
	initialize: function() {
		this.messages = new Messages;
		this.messages.url = constants.apiurl + '/threads/' + this.id + '/messages';

		if(this.get('bevy')) {
			var bevy = BevyStore.getBevy(this.get('bevy')._id);
			this.set('bevy', bevy);
		}
	}
});

module.exports = ThreadModel;
