'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

var Post = Backbone.Model.extend({
	defaults: {
		  id: null
		, title: null
		, body: null
		, image_url: null
		, author: null
		, bevy: null
		, comments: []
		, comment_count: 0
		, point_count: 0
		, created: new Date()
		, updated: new Date()
	},

	// where to send the rest calls
	url: function() {
		return (this.id) ? '/posts/' + this.id : '/posts/';
	}
});

Dispatcher.on('all', function(eventName, payload) {
	switch(eventName) {

	}
});
