'use strict';

// TODO: grab according to specified bevy

var Backbone = require('backbone');
var _ = require('underscore');

var Dispatcher = require('./../shared/dispatcher');

// register dispatcher
var dispatchId = Dispatcher.register(handleDispatch);


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

posts.add({
	title: 'test'
});

var PostStore = {
	getAll: function() {
		// plug sorting (new/top) into here?
		return posts.toJSON();
	}
};

module.exports = PostStore;

function create(options) {
	var newPost = new Post({
		  title: options.title
		, body: options.body
		, image_url: options.image_url
		, author: options.author
		, bevy: options.bevy
	});

	// PUT to db
	newPost.save();

	console.log('new post id:', newPost.id);

	posts.add(newPost);
}


function handleDispatch(eventName, payload) {
	var
	  title
	, body
	, image_url
	, author
	, bevy;

	switch(eventName) {
		case 'create':
			title = payload.title;
			body = payload.body;
			image_url = payload.image_url;
			author = payload.author;
			bevy = payload.bevy;

			create({
				  title: title
				, body: body
				, image_url: image_url
				, author: author
				, bevy: bevy
			});
			break;
	}
}
