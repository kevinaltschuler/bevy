/**
 * notifications.js
 *
 * API for notifications
 *
 * @author albert
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var messageBus = new EventEmitter();

var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');
var error = require('./../error');

var mailgun = require('./../config/mailgun')();
var User = mongoose.model('User');

var paramNames = 'event message email bevy user members';

var emitter = new EventEmitter();
emitter.setMaxListeners(0);

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

	//channel.publish(params.event, params);
	//emitter.emit(params.event, params);

	switch(params.event) {
		case 'test':
			//console.log(params);
			break;
		case 'invite:email':
			var members = params.members;
			var bevy = params.bevy;
			var inviter = params.user;

			members.forEach(function(email) {
				async.waterfall([
					function(done) {
						// push the notification object onto a matching user
						var query = { email: email };
						var promise = User.findOne(query).exec();
						promise.then(function(user) {
							if(!user) done(null);
							var notification = {
								event: 'invite',
								data: {
									bevy: bevy,
									from_user: inviter
								}
							}
							user.notifications.push(notification);
							user.save(function(err, $user) {
								if(err) return done(err);
								emitter.emit('invite:email:' + user._id, $user.notifications.toObject()[$user.notifications.length - 1]);
								done(null);
							});

						}, function(err) {
							return done(err);
						});
					},

					function(done) {
						// then send the invite email

						var inviter_name = (inviter.google)
						? inviter.google.name.givenName + ' ' + inviter.google.name.familyName
						: inviter.email;

						mailgun.messages().send({
							from: 'Bevy Team <contact@bvy.io>',
							to: email,
							subject: 'Invite',
							text: 'Invite to ' + bevy.name + ' from ' + inviter_name
						}, function(err, body) {
							if(err) {
								return done(err);
							}
						});
					}
				]);
			});

			break;
	}

	return res.json(params);
}

// GET /users/:userid/notifications
exports.index = function(req, res, next) {
	var userid = req.params.userid;
	var query = { _id: userid };
	var promise = User.findOne(query).exec();
	promise.then(function(user) {
		var notifications = user.notifications.toObject();
		return res.json(notifications);
	}, function(err) {
		return next(err);
	});
}

// GET /users/:userid/notifications/:id
exports.show = function(req, res, next) {
	var userid = req.params.userid;
	var query = { _id: userid };
	var promise = User.findOne(query).exec();
	promise.then(function(user) {
		var id = req.params.id;
		var notification = user.notifications.id(id);
		return res.json(notification);
	}, function(err) {
		return next(err);
	});
}

// GET /users/:userid/notifications/:id/destroy
// DELETE /users/:userid/notifications
exports.destroy = function(req, res, next) {
	var userid = req.params.userid;
	var query = { _id: userid };
	var promise = User.findOne(query).exec();
	promise.then(function(user) {
		var id = req.params.id;
		user.notifications.remove(id);
		user.save(function(err) {
			if(err) return next(err);
			return res.json(user.notifications.toObject());
		});
	}, function(err) {
		return next(err);
	});
}

exports.poll = function(req, res, next) {
	var user_id = req.params.userid;
	emitter.on('invite:email:' + user_id, function(invite) {
		return res.json(invite);
	});
}
