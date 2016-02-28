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

exports.version = '2.0.0';

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
  {email: 'katniss.ev@district12.gov', name: 'everdeen'},
  {email: 'madvillain@doom.mf', name: 'dandumille'},
];

exports.hintTexts = [
  "What's on your mind?",
  "What's up?",
  "How's it going?",
  "What's new?",
  "How are you doing today?",
  "Share your thoughts",
  "Drop some knowledge buddy",
  "Drop a line",
  "What's good?",
  "What do you have to say?",
  "Spit a verse",
  "What would your mother think?",
  "Tell me about yourself",
  "What are you thinking about?",
  "Gimme a bar",
  "Lets talk about our feelings",
  "Tell me how you really feel",
  "How was last night?",
  "What's gucci?",
  "Anything worth sharing?",
];

exports.APP = {
  LOAD: 'app_load',
  LOAD_USER: 'app_load_user',
  OPEN_SIDEBAR: 'user_open_sidebar',
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
  SEARCHING: 'post_searching',
  SEARCH_COMPLETE: 'post_search_complete',
  SEARCH_ERROR: 'post_search_error',

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
  CREATE: 'bevy_create',
  CREATE_SUCCESS: 'bevy_create_success',
  CREATE_ERR: 'bevy_create_err',
  DESTROY: 'bevy_destroy',
  UPDATE: 'bevy_update',

  CHANGE_ALL: 'bevy_change_all',
  CHANGE_ONE: 'bevy_change_one'
};

exports.BOARD = {
  CREATE: 'board_create',
  DESTROY: 'board_destroy',
  UPDATE: 'board_update',
  SWITCH: 'board_switch',
  JOIN: 'board_join',
  LEAVE: 'board_leave',
  SWITCHED: 'board_switched',

  CHANGE_ALL: 'board_change_all'
};

exports.USER = {
  // actions
  UPDATE: 'user_update',
  SEARCH: 'user_search',
  LOGIN: 'user_login',
  REGISTER: 'user_register',
  REFRESH_TOKEN: 'user_refresh_token',
  LOADED: 'user_loaded',

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
  SEARCHING: 'user_searching',
  SEARCH_COMPLETE: 'user_search_complete'
};

exports.NOTIFICATION = {
  DISMISS: 'notification_dismiss',
  READ: 'notification_read',

  CHANGE_ALL: 'notification_change_all'
};

exports.INVITE = {
};
