/**
 * ChatActions.js
 *
 * @author albert
 */

'use strict';

var dispatch = require('./../shared/helpers/dispatch');

var constants = require('./../constants');

var CHAT = constants.CHAT;

var ChatActions = {

	startPM(user_id) {
		dispatch(CHAT.START_PM, {
			user_id: user_id
		});
	},

	openThread(thread_id, user_id) {
		dispatch(CHAT.THREAD_OPEN, {
			thread_id: (thread_id == undefined) ? null : thread_id
		});
	},

	closePanel(thread_id) {
		dispatch(CHAT.PANEL_CLOSE, {
			thread_id: thread_id
		});
	},

	createMessage(thread_id, author, body) {
		dispatch(CHAT.MESSAGE_CREATE, {
			thread_id: thread_id,
			author: author,
			body: body
		});
	},

	loadMore(thread_id) {
		dispatch(CHAT.MESSAGE_FETCH_MORE, {
			thread_id: thread_id
		});
	}
};

module.exports = ChatActions;
