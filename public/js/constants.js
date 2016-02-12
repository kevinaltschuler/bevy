/**
 * constants.js
 *
 * list of constants to use when dispatching and receiving events
 * also sets some nifty environment variables
 *
 * @author albert
 * @flow
 */

'use strict';

exports.version = '1.0.4';

exports.env = window.bootstrap.env;

var hostname = window.location.hostname;
var port = (window.location.port == 80) ? '' : (':' + window.location.port);
var protocol = location.protocol;

var slashes = '//';

var api_subdomain = 'api';
var api_version = '';

if(window.bootstrap.env == 'production') {
  exports.domain = 'joinbevy.com';
  exports.siteurl = 'http://joinbevy.com';
  exports.apiurl = 'http://joinbevy.com/api';
} else {
  exports.domain = 'bevy.dev';
  exports.siteurl = 'http://bevy.dev';
  exports.apiurl = 'http://bevy.dev/api';
}

exports.client_id = 'web';
exports.client_secret = 'THE-ROCK-WE-ALL-PUSH';

exports.hostname = hostname;
exports.protocol = protocol;
exports.api_subdomain = api_subdomain;
exports.api_version = api_version;

exports.viewportWidth = window.innerWidth;
exports.viewportHeight = window.innerHeight;

exports.chatSidebarWidthClosed = 55;
exports.chatSidebarWidthOpen = 200;
exports.chatSidebarSearchHeight = 'calc(100% - 40px)';

exports.defaultProfileImage = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';

exports.fakeUsers = [
  {email: 'spaceman.spiff@gross.club', name: 'spiff'},
  {email: 'luke@tatoo.ine', name: 'luke'},
  {email: 'scout.finch@maycomb.al', name: 'scout'},
  {email: 'peter@neverland.net', name: 'pete'},
  {email: 'huck.finn@mississippi.ri', name: 'huckleberry'},
  {email: 'bilbo.baggins@shire.net', name: 'bilbo'},
  {email: 'charlie.bucket@wonka.co', name: 'charlie.bucket'},
  {email: 'katniss.everdeen@district12.gov', name: 'everdeen'},
  {email: 'madvillain@doom.mf', name: 'dandumille'},
];

exports.APP = {
  LOAD: 'app_load',
  LOAD_USER: 'app_load_user'
};

exports.POST = {
  CREATE: 'post_create',
  DESTROY: 'post_destroy',
  VOTE: 'post_vote',
  SORT: 'post_sort',
  CANCEL: 'post_cancel',
  UPDATE: 'post_update',
  PIN: 'post_pin',
  FETCH: 'post_fetch',
  FETCH_SINGLE: 'post_fetch_single',
  LOAD: 'post_load',

  CHANGE_ALL: 'post_change_all',
  CHANGE_ONE: 'post_change_one:',
  POSTED_POST: 'post_posted_post',
  CANCELED_POST: 'post_canceled_post',


};

exports.COMMENT = {
  CREATE: 'comment_create',
  DESTROY: 'comment_destroy',
  VOTE: 'comment_vote'
}

exports.BEVY = {
  LOADBEVYVIEW: 'bevy_load_bevy_view',
  CREATE: 'bevy_create',
  DESTROY: 'bevy_destroy',
  UPDATE: 'bevy_update',
  JOIN: 'bevy_join',
  REQUEST_JOIN: 'bevy_request_join',
  LEAVE: 'bevy_leave',
  SWITCH: 'bevy_switch',
  SORT: 'bevy_sort',
  SEARCH: 'bevy_search',
  LOADED: 'bevy_loaded',

  SEARCHING: 'bevy_searching',
  SEARCH_COMPLETE: 'bevy_search_complete',
  CHANGE_ALL: 'bevy_change_all',
  CHANGE_ONE: 'bevy_change_one',
  UPDATED_IMAGE: 'bevy_updated_image'
};

exports.BOARD = {
  LOADBOARDVIEW: 'board_load_board_view',
  CREATE: 'board_create',
  DESTROY: 'board_destroy',
  UPDATE: 'board_update',
  SWITCH: 'board_switch',
  LOADED: 'board_loaded',
  JOIN: 'board_join',
  LEAVE: 'board_leave',
  GET: 'board_get',

  CHANGE_ALL: 'board_change_all'
};

exports.USER = {
  // actions
  UPDATE: 'user_update',
  SEARCH: 'user_search',
  LOGIN: 'user_login',
  REGISTER: 'user_register',
  REFRESH_TOKEN: 'user_refresh_token',
  VERIFY_USERNAME: 'user_verify_username',
  LOADED: 'user_loaded',
  ADDBEVY: 'user_add_bevy',

  // events
  LOGGING_IN: 'user_logging_in',
  LOGIN_SUCCESS: 'user_login_success',
  LOGIN_ERROR: 'user_login_error',
  REGISTERING: 'user_registering',
  REGISTER_SUCCESS: 'user_register_success',
  REGISTER_ERROR: 'user_register_error',
  REFRESHING_TOKEN: 'user_refreshing_token',
  REFRESH_TOKEN_SUCCESS: 'user_refresh_token_success',
  REFRESH_TOKEN_ERROR: 'user_refresh_token_error',
  VERIFYING_USERNAME: 'user_verifying_username',
  VERIFY_USERNAME_SUCCESS: 'user_verify_username_success',
  VERIFY_USERNAME_ERROR: 'user_verify_username_error',
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

  UPDATE_IMAGE: 'chat_update_image',
  FETCH_THREADS: 'chat_fetch_threads'
};

exports.INVITE = {
  INVITE_USER: 'invite_invite_user',
  DESTROY: 'invite_destroy',
  ACCEPT_REQUEST: 'invite_accept_request',
  REJECT_INVITE: 'invite_reject_invite'
};
