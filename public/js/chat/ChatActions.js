'use strict';

var dispatch = require('./../shared/helpers/dispatch');

var constants = require('./../constants');

var CHAT = constants.CHAT;

var ChatActions = {

	openThread: function(thread_id) {
		dispatch(CHAT.THREAD_OPEN, {
			thread_id: thread_id
		});
	},

	closePanel: function(thread_id) {
		dispatch(CHAT.PANEL_CLOSE, {
			thread_id: thread_id
		});
	},

	createMessage: function(thread_id, author, body) {
		dispatch(CHAT.MESSAGE_CREATE, {
			thread_id: thread_id,
			author: author,
			body: body
		});
	},

	loadMore: function(thread_id) {
		dispatch(CHAT.MESSAGE_FETCH_MORE, {
			thread_id: thread_id
		});
	}
};

module.exports = ChatActions;
