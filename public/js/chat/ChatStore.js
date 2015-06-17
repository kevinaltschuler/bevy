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
var localStorage = window.localStorage;

_.extend(ChatStore, {

	threads: new ThreadCollection,
	openThreads: [],

	handleDispatch: function(payload) {
		switch(payload.actionType) {
			case APP.LOAD:

				// fetch threads
				var threads = window.bootstrap.threads;
				this.threads.reset(threads);
				this.threads.forEach(function(thread) {
					// fetch messages
					// TODO: only get one
					thread.messages.fetch({
						reset: true,
						success: function(collection, response, options) {
							thread.messages.sort();
							this.trigger(CHAT.CHANGE_ALL);
						}.bind(this)
					});
				}.bind(this));

				break;

			case CHAT.THREAD_OPEN:
				var thread_id = payload.thread_id;

				if(this.openThreads.indexOf(thread_id) > -1) {
					// already found it
					// just open the panel
					break;
				}

				var thread = this.threads.get(thread_id);
				if(thread == undefined) return;

				// fetch messages
				thread.messages.fetch({
					remove: false,
					success: function(collection, response, options) {
						thread.messages.sort();
						this.trigger(CHAT.MESSAGE_FETCH + thread_id);
					}.bind(this)
				});

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
						message.set('_id', model.id);
						message.set('author', model.get('author'));
						message.set('created', model.get('created'));
						this.trigger(CHAT.MESSAGE_FETCH + thread_id);
					}.bind(this)
				});

				break;

			case CHAT.MESSAGE_FETCH_MORE:
				var thread_id = payload.thread_id;
				var thread = this.threads.get(thread_id);

				if(thread == undefined) return;

				var message_count = thread.messages.models.length;
				//console.log(message_count);
				// set query variable
				thread.messages.url += ('?skip=' + message_count);
				thread.messages.fetch({
					remove: false,
					success: function(collection, response, options) {
						thread.messages.sort();
						this.trigger(CHAT.MESSAGE_FETCH + thread_id);
					}.bind(this)
				});
				// reset url
				thread.messages.url = constants.apiurl + '/threads/' + thread.id + '/messages';

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
			if(thread != undefined) threads.push(thread.toJSON());
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

	getLatestMessage: function(thread_id) {
		var thread = this.threads.get(thread_id);
		if(thread == undefined) {
			return {};
		}
		var message = thread.messages.at(thread.messages.length - 1);
		if(message == undefined) return {};
		else return message.toJSON();
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
