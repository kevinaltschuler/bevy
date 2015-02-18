'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

// register dispatcher
var dispatchId = Dispatcher.register(handleDispatch);

function handleDispatch(eventName, payload) {
	switch(eventName) {

	}
}

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

var Posts = Backbone.Collection.extend({
	  model: Post
	, url: '/posts'
});
var posts = new Posts;

var PostStore = {
	getAll: function() {
		// plug sorting (new/top) into here?
		return posts.toJSON();
	}
};

module.exports = PostStore;
