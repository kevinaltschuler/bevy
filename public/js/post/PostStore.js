'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Post = Backbone.Model.extend({
	defaults: {
		  title: null
		, body: null
		, image_url: null
		, author: null
		, bevy: null
		, comments: []
		, comment_count: 0
		, point_count: 0
		, created: new Date()
		, updated: new Date()
	}
});
