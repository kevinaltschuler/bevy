'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Post = Backbone.Model.extend({
	defaults: {
		  image_url: null
		, comment_count: 0
		, point_count: 0
		, created: new Date()
		, updated: new Date()
		, author: null
		, comments: []
		, bevy: null
		, title: null
		, body: null
	}
});
