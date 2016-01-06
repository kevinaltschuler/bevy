/**
 * ChatActions.js
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var CHAT = constants.CHAT;

var ChatActions = {
  sendNewMessage() {
    Dispatcher.dispatch({
      actionType: CHAT.SEND_NEW_MESSAGE
    });
  },

  cancelNewMessage() {
    Dispatcher.dispatch({
      actionType: CHAT.CANCEL_NEW_MESSAGE
    });
  },

  createThreadAndMessage(addedUsers, message_body) {
    Dispatcher.dispatch({
      actionType: CHAT.CREATE_THREAD_AND_MESSAGE,
      addedUsers: addedUsers,
      message_body: message_body
    });
  },

  addUsers(thread_id, users) {
    Dispatcher.dispatch({
      actionType: CHAT.ADD_USERS,
      thread_id: thread_id,
      users: users
    });
  },

  removeUser(thread_id, user_id) {
    Dispatcher.dispatch({
      actionType: CHAT.REMOVE_USER,
      thread_id: thread_id,
      user_id: user_id
    });
  },

  deleteThread(thread_id) {
    Dispatcher.dispatch({
      actionType: CHAT.DELETE_THREAD,
      thread_id: thread_id
    });
  },

  editThread(thread_id, name, image) {
    Dispatcher.dispatch({
      actionType: CHAT.EDIT_THREAD,
      thread_id: thread_id,
      name: (name == undefined) ? null : name,
      image: (image == undefined) ? null : image
    });
  },

  startPM(user_id) {
    Dispatcher.dispatch({
      actionType: CHAT.START_PM,
      user_id: user_id
    });
  },

  startBevyChat(bevy_id) {
    Dispatcher.dispatch({
      actionType: CHAT.START_BEVY_CHAT,
      bevy_id: bevy_id
    });
  },

  openThread(thread_id, user_id) {
    Dispatcher.dispatch({
      actionType: CHAT.THREAD_OPEN,
      thread_id: thread_id
    });
  },

  closePanel(thread_id) {
    Dispatcher.dispatch({
      actionType: CHAT.PANEL_CLOSE,
      thread_id: thread_id
    });
  },

  createMessage(thread_id, author, body) {
    Dispatcher.dispatch({
      actionType: CHAT.MESSAGE_CREATE,
      thread_id: thread_id,
      author: author,
      body: body
    });
  },

  loadMore(thread_id) {
    Dispatcher.dispatch({
      actionType: CHAT.MESSAGE_FETCH_MORE,
      thread_id: thread_id
    });
  },

  updateImage(thread_id, image) {
    Dispatcher.dispatch({
      actionType: CHAT.UPDATE_IMAGE,
      thread_id: thread_id,
      image: image
    });
  }
};

module.exports = ChatActions;
