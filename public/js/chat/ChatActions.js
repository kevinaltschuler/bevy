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

  sendNewMessage() {
    dispatch(CHAT.SEND_NEW_MESSAGE, {});
  },

  cancelNewMessage() {
    dispatch(CHAT.CANCEL_NEW_MESSAGE, {});
  },

  createThreadAndMessage(addedUsers, message_body) {
    dispatch(CHAT.CREATE_THREAD_AND_MESSAGE, {
      addedUsers: addedUsers,
      message_body: message_body
    });
  },

  addUsers(thread_id, users) {
    dispatch(CHAT.ADD_USERS, {
      thread_id: thread_id,
      users: users
    });
  },

  removeUser(thread_id, user_id) {
    dispatch(CHAT.REMOVE_USER, {
      thread_id: thread_id,
      user_id: user_id
    });
  },

  deleteThread(thread_id) {
    dispatch(CHAT.DELETE_THREAD, {
      thread_id: thread_id
    });
  },

  startPM(user_id) {
    dispatch(CHAT.START_PM, {
      user_id: user_id
    });
  },

  startBevyChat(bevy_id) {
    dispatch(CHAT.START_BEVY_CHAT, {
      bevy_id: bevy_id
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
