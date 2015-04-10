/**
 * constants.js
 *
 * list of constants to use when dispatching and receiving events
 * also sets some nifty environment variables
 *
 * @author albert
 */

'use strict';

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

exports.POST = {
	CREATE: 'post_create',
	DESTROY: 'post_destroy',
	UPVOTE: 'post_upvote',
	DOWNVOTE: 'post_downvote',
	SORT: 'post_sort',

	CHANGE_ALL: 'post_change_all',
	CHANGE_ONE: 'post_change_one'
};

exports.BEVY = {
	CREATE: 'bevy_create',
	DESTROY: 'bevy_destroy',
	UPDATE: 'bevy_update',
	SET_NOTIFICATION_LEVEL: 'bevy_set_notification_level',
	LEAVE: 'bevy_leave',
	SWITCH: 'bevy_switch',
	INVITE: 'bevy_invite',
	ADD_USER: 'bevy_add_user',

	FETCH: 'bevy_fetch',

	CHANGE_ALL: 'bevy_change_all',
	CHANGE_ONE: 'bevy_change_one'
};

exports.ALIAS = {
	CREATE: 'alias_create',
	DESTROY: 'alias_destroy',
	UPDATE: 'alias_update',
	SWITCH: 'alias_switch',

	CHANGE_ALL: 'alias_change_all'
};

exports.NOTIFICATION = {
	  DISMISS: 'notification_dismiss',

	  CHANGE_ALL: 'notification_change_all'
};
