'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var APP = constants.APP;
var CHAT = constants.CHAT

var ThreadCollection = require('./ThreadCollection');

var ChatStore = _.extend({}, Backbone.Events);

var user = window.bootstrap.user;

_.extend(ChatStore, {

	threads: new ThreadCollection,
	openThreads: [],

	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case APP.LOAD:

				this.threads.fetch({
					reset: true,
					success: function(collection, response, options) {
						//console.log(collection);
						this.trigger(CHAT.CHANGE_ALL);
					}.bind(this)
				});

				break;

			case CHAT.THREAD_OPEN:
				var thread_id = payload.thread_id;
				//console.log(thread_id);

				if(this.openThreads.indexOf(thread_id) > -1) {
					// already found it
					// just open the panel
					break;
				}

				var thread = this.threads.get(thread_id);
				if(thread.messages.models.length <= 0) {
					thread.messages.fetch({
						reset: true,
						success: function(collection, response, options) {
							this.trigger(CHAT.MESSAGE_FETCH + thread_id);
						}.bind(this)
					});
				}

				this.openThreads.push(thread_id);

				this.trigger(CHAT.CHANGE_ALL);
				break;

			case CHAT.PANEL_CLOSE:
				var thread_id = payload.thread_id;

				var index = this.openThreads.indexOf(thread_id);
				if(index > -1) {
					this.openThreads.splice(index, 1);
				}

				this.trigger(CHAT.CHANGE_ALL);
				break;

			case CHAT.MESSAGE_CREATE:
				var thread_id = payload.thread_id;
				var author = payload.author;
				var body = payload.body;

				var thread = this.threads.get(thread_id);
				var message = thread.messages.add({
					thread: thread_id,
					author: author._id,
					body: body
				});
				message.save(null, {
					success: function(model, response, options) {
						message.set('_id', model.get('_id'));
						message.set('author', model.get('author'));
						this.trigger(CHAT.MESSAGE_FETCH + thread_id);
					}.bind(this)
				});

				break;
		}
	},

	getAllThreads: function() {
		return (_.isEmpty(this.threads.models))
			? []
			: this.threads.toJSON();
	},

	getOpenThreads: function() {
		var threads = [];
		this.openThreads.forEach(function(thread_id) {
			var thread = this.threads.get(thread_id);
			if(!_.isEmpty(thread)) threads.push(thread.toJSON());
		}.bind(this));
		return threads;
	},

	getMessages: function(thread_id) {
		var thread = this.threads.get(thread_id);
		if(thread == undefined) {
			// thread not found
			return [];
		} else {
			return thread.messages.toJSON();
		}
	},

	addMessage: function(message) {
		var thread = this.threads.get(message.thread);
		if(thread == undefined) {
			return;
		} else {
			// dont get the message you just added
			// TODO: do this on the server?
			if(message.author._id == user._id) return;

			thread.messages.add(message);
			this.trigger(CHAT.MESSAGE_FETCH + message.thread);
		}
	}
});

Dispatcher.register(ChatStore.handleDispatch.bind(ChatStore));
module.exports = ChatStore;
