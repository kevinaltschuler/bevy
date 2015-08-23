/**
 * constants.js
 *
 * list of constants to use when dispatching and receiving events
 * also sets some nifty environment variables
 *
 * @author albert
 */

'use strict';

exports.version = '0.3.0';

var hostname = window.location.hostname;
var protocol = location.protocol;

var slashes = '//';

var api_subdomain = 'api';
var api_version = '';

exports.siteurl = protocol + slashes + hostname;
exports.apiurl = protocol + slashes + api_subdomain + '.' + api_version + hostname;

exports.hostname = hostname;
exports.protocol = protocol;
exports.api_subdomain = api_subdomain;
exports.api_version = api_version;

exports.viewportWidth = window.innerWidth;
exports.viewportHeight = window.innerHeight;

exports.chatSidebarWidthClosed = 55;
exports.chatSidebarWidthOpen = 200;
exports.chatSidebarSearchHeight = 300;

exports.defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

exports.APP = {
  LOAD: 'app_load'
};

exports.POST = {
  CREATE: 'post_create',
  DESTROY: 'post_destroy',
  UPVOTE: 'post_upvote',
  DOWNVOTE: 'post_downvote',
  SORT: 'post_sort',
  CANCEL: 'post_cancel',
  UPDATE: 'post_update',
  MUTE: 'post_mute',
  PIN: 'post_pin',

  FETCH: 'post_fetch',

  CHANGE_ALL: 'post_change_all',
  CHANGE_ONE: 'post_change_one:',
  POSTED_POST: 'post_posted_post',
  CANCELED_POST: 'post_canceled_post',

  LOAD: 'post_load'
};

exports.COMMENT = {
  CREATE: 'comment_create',
  DESTROY: 'comment_destroy',
  VOTE: 'comment_vote'
}

exports.BEVY = {
  CREATE: 'bevy_create',
  DESTROY: 'bevy_destroy',
  UPDATE: 'bevy_update',
  LEAVE: 'bevy_leave',
  SWITCH: 'bevy_switch',
  SORT: 'bevy_sort',
  SEARCH: 'bevy_search',
  UPDATE_TAGS: 'bevy_update_tags',

  SEARCHING: 'bevy_searching',
  SEARCH_COMPLETE: 'bevy_search_complete',
  CHANGE_ALL: 'bevy_change_all',
  CHANGE_ONE: 'bevy_change_one',
  UPDATED_IMAGE: 'bevy_updated_image'
};

exports.USER = {
  UPDATE: 'user_update',
  SEARCH: 'user_search',

  SEARCHING: 'user_searching',
  SEARCH_COMPLETE: 'user_search_complete'
};

exports.NOTIFICATION = {
  DISMISS: 'notification_dismiss',
  READ: 'notification_read',

  CHANGE_ALL: 'notification_change_all'
};

exports.CHAT = {
  SEND_NEW_MESSAGE: 'chat_send_new_message',
  CANCEL_NEW_MESSAGE: 'chat_cancel_new_message',
  CREATE_THREAD_AND_MESSAGE: 'chat_create_thread_and_message',

  ADD_USERS: 'chat_add_user',
  REMOVE_USER: 'chat_remove_user',

  DELETE_THREAD: 'chat_delete_thread',
  EDIT_THREAD: 'chat_edit_thread',

  START_PM: 'chat_start_pm',
  START_BEVY_CHAT: 'chat_start_bevy_chat',
  THREAD_OPEN: 'chat_thread_open',
  PANEL_CLOSE: 'chat_panel_close',
  MESSAGE_CREATE: 'chat_message_create',

  MESSAGE_FETCH: 'chat_message_fetch:',
  MESSAGE_FETCH_MORE: 'chat_message_fetch_more',

  CHANGE_ALL: 'chat_change_all',

  PANEL_TOGGLE: 'chat_panel_toggle:',

  UPDATE_IMAGE: 'chat_update_image'
};
