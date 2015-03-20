/**
 * notifications.js
 *
 * API for notifications
 *
 * @author albert
 */

'use strict';

var _ = require('underscore');
var error = require('./../error');
var client = require('./../mubsub').client();
//var channel = require('./../mubsub').notification_channel;
var channel = client.channel('notifications');

var paramNames = 'event message email bevy alias members';

function collectParams(req) {
	var params = {};
	paramNames.split(' ').forEach(function(param) {
		var val = null;
		if(req.body != undefined) val = req.body[param];
		if(!val && !_.isEmpty(req.query)) val = req.query[param];
		if(!val) return;
		params[param] = val;
	});
	return params;
}

exports.create = function(req, res, next) {
	var params = collectParams(req);

	if(!params.event) {
		return next(error.gen('no event supplied'));
	}

	channel.publish(params.event, params);

	return res.json(params);
}
