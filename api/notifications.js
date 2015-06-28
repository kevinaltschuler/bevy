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
var Comment = mongoose.model('Comment');
var Post = mongoose.model('Post');
var Bevy = mongoose.model('Bevy');
var Notification = mongoose.model('Notification');
var Member = mongoose.model('BevyMember');

var paramNames = 'event message email bevy user members';

var emitter = new EventEmitter();
emitter.setMaxListeners(0);

exports.emitter = emitter;

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

	switch(params.event) {
		case 'test':
			//console.log(params);
			break;
		case 'invite:email':
			var members = params.members;
			var bevy_id = req.body['bevy_id'];
			var bevy_name = req.body['bevy_name'];
			var bevy_img = req.body['bevy_img'];
			var inviter_name = req.body['inviter_name'];

			var template = require('./../public/html/email/template.jsx')(bevy_name, inviter_name, bevy_id);

			var notifications = [];

			async.waterfall([
				function(done) {
					members.forEach(function(email) {
						// push the notification object onto a matching user
						User.findOne({ email: email }, function(err, user) {
							if(err) return next(err);
							if(!user) {
								notifications.push({
									email: email,
									event: 'invite:email',
									data: {
										bevy_id: bevy_id,
										bevy_name: bevy_name,
										bevy_img: bevy_img,
										inviter_name: inviter_name
									}
								});
							} else {
								notifications.push({
									user: user._id,
									event: 'invite:email',
									data: {
										bevy_id: bevy_id,
										bevy_name: bevy_name,
										bevy_img: bevy_img,
										inviter_name: inviter_name
									}
								});
							}

							if(notifications.length == members.length) done(null); // continue when ready
						});

						// then send the invite email
						mailgun.messages().send({
							from: 'Bevy Team <contact@joinbevy.com>',
							to: email,
							subject: 'Invite',
							html: template
						}, function(err, body) {
							if(err) return next(err);
						});
					});
				},
				function(err, done) {
					Notification.create(notifications, function(err, $notifications) {
						if(err) return next(err);
						if(_.isEmpty($notifications)) return next();
						// emit event
						if(_.isArray($notifications)) {
							$notifications.forEach(function(notification) {
								if(!_.isEmpty(notification.user))
									emitter.emit(notification.user, notification);
							});
						} else {
							if(!_.isEmpty($notifications.user))
								emitter.emit($notifications.user, $notifications);
						}
					});
				}
			]);

			break;

		case 'post:create':
			var author_name = req.body['author_name'];
			var author_img = req.body['author_img'];
			var bevy_name = req.body['bevy_name'];
			var bevy_members = req.body['bevy_members'];
			var post_title = req.body['post_title'];

			var members = [];
			members = _.filter(bevy_members, function(member) {
				return member.notificationLevel == 'all';
			});

			var notifications = [];
			members.forEach(function(member) {
				if(_.isEmpty(member.user)) return;
				notifications.push({
					user: member.user,
					event: 'post:create',
					data: {
						author_name: author_name,
						author_img: author_img,
						bevy_name: bevy_name,
						post_title: post_title
					}
				});
			});

			Notification.create(notifications, function(err, $notifications) {
				if(err) return next(err);
				if(_.isEmpty($notifications)) return next();
				// emit event
				if(_.isArray($notifications)) {
					$notifications.forEach(function(notification) {
						if(!_.isEmpty(notification.user))
							emitter.emit(notification.user, notification);
					});
				} else {
					if(!_.isEmpty($notifications.user))
						emitter.emit($notifications.user, $notifications);
				}
			});

			break;

		case 'bevy:requestjoin':

			var bevy_id = req.body['bevy_id'];
			var bevy_name = req.body['bevy_name'];
			var user_id = req.body['user_id'];
			var user_name = req.body['user_name'];
			var user_image = req.body['user_image'];
			var user_email = req.body['user_email'];

			// send to all admins
			Member.find({ bevy: bevy_id }, function(err, members) {
				if(err) return next(err);
				console.log(bevy_id, members);
				var admins = _.where(members, { role: 'admin' });
				var notifications = [];
				admins.forEach(function(admin) {
					notifications.push({
						user: admin.user,
						event: 'bevy:requestjoin',
						data: {
							bevy_id: bevy_id,
							bevy_name: bevy_name,
							user_id: user_id,
							user_name: user_name,
							user_image: user_image,
							user_email: user_email
						}
					});
				});

				Notification.create(notifications, function(err, $notifications) {
					if(err) return next(err);
					// emit event
					if(_.isArray($notifications)) {
						$notifications.forEach(function(notification) {
							emitter.emit(notification.user, notification);
						});
					} else {
						emitter.emit($notifications.user, $notifications);
					}
				});
			}).lean();

			break;

		case 'comment:create':
			var author_id = req.body['author_id'];
			var author_name = req.body['author_name'];
			var author_image = req.body['author_image'];
			var post_id = req.body['post_id'];
			var post_title = req.body['post_title'];
			var post_author_id = req.body['post_author_id'];
			var post_muted_by = req.body['post_muted_by'];
			var bevy_name = req.body['bevy_name'];
			var bevy_members = req.body['bevy_members'];

			var notifications = [];

			// dont do anything for users who've muted this post
			bevy_members = _.reject(bevy_members, function(member) {
				return _.contains(post_muted_by, member);
			});

			// send reply notification to post author
			//	get member - match post author id
			var post_author_member = _.findWhere(bevy_members, { user: post_author_id });

			if(post_author_member) {
				// check if notification level is 'my' or 'all'
				if(post_author_member.notificationLevel == 'none') {
				} else {
					// send reply notification
					notifications.push({
						user: post_author_id,
						event: 'post:reply',
						data: {
							author_name: author_name,
							author_image: author_image,
							post_title: post_title,
							bevy_name: bevy_name
						}
					});
				}
			}

			//	send comment notification to all commentators
			async.waterfall([
				function(done) {
					// loop thru comments and collect authors
					var commentators = [];
					Comment.find({ postId: post_id }, function(err, comments) {
						comments.forEach(function(comment) {
							commentators.push(comment.author);
						});
						// remove dupes
						commentators = _.uniq(commentators);
						done(null, commentators);
					}).lean();
				},
				function(commentators, done) {
					commentators.forEach(function(commentator) {
						var commentator_member = _.findWhere(bevy_members, { user: commentator.toString() });

						if(commentator_member) {
							// TODO: (see if they muted the post)
							// check if notification level is 'none'
							if(commentator_member.notificationLevel == 'none') {
								return;
							} else {
								// send commented notification
								notifications.push({
									user: commentator,
									event: 'post:commentedon',
									data: {
										author_name: author_name,
										author_image: author_image,
										post_title: post_title,
										bevy_name: bevy_name
									}
								});
							}
						}
					});
				}
			]);

			Notification.create(notifications, function(err, $notifications) {
				if(err) return next(err);
				// emit event
				if(_.isArray($notifications)) {
					$notifications.forEach(function(notification) {
						emitter.emit(notification.user, notification);
					});
				} else {
					emitter.emit($notifications.user, $notifications);
				}
			});

			break;
	}

	return res.json(params);
}

// GET /users/:userid/notifications
exports.index = function(req, res, next) {
	var userid = req.params.userid;
	var query = { user: userid };
	var promise = Notification.find(query).exec();
	promise.then(function(notifications) {
		return res.json(notifications);
	}, function(err) {
		return next(err);
	});
}

// GET /users/:userid/notifications/:id
exports.show = function(req, res, next) {
	var id = req.params.id;
	Notification.findOne({ _id: id }, function(err, notification) {
		if(err) return next(err);
		return res.json(notification);
	});
}

// GET /users/:userid/notifications/:id/destroy
// DELETE /users/:userid/notifications
exports.destroy = function(req, res, next) {
	var id = req.params.id;
	Notification.findOneAndRemove({ _id: id }, function(err, notification) {
		if(err) return next(err);
		return res.json(notification);
	});
}

exports.poll = function(req, res, next) {
	var user_id = req.params.userid;
	emitter.on(user_id, function(notification) {
		if(!res.headersSent)
			return res.json({
				type: 'notification',
				data: notification
			});
		else return res.end();
	});
	emitter.on(user_id + ':chat', function(message) {
		if(!res.headersSent)
			return res.json({
				type: 'message',
				data: message
			});
		else return res.end();
	});
}



exports.make = function(type, payload) {
	switch(type) {
		case 'post:create':
			var post = JSON.parse(JSON.stringify(payload.post));
			var author = post.author;
			var bevy = post.bevy;

			var notifications = [];
			// get members of the bevy
			// see if they want the notification
			Member.find({ bevy: bevy._id }, function(err, members) {
				if(err) return;
				if(_.isEmpty(members)) return;
				members = _.filter(members, function(member) {
					return member.notificationLevel == 'all';
				});
				members.forEach(function(member) {
					if(_.isEmpty(member.user)) return;
					if(member.user.toString() == author._id) return; // dont send a notification to the post's author
					notifications.push({
						user: member.user,
						event: 'post:create',
						data: {
							author_name: (bevy.settings.anonymise_users) ? member.displayName : author.displayName,
							author_img: (bevy.settings.anonymise_users) ? member.image_url : author.image_url,
							bevy_id: bevy._id,
							bevy_name: bevy.name,
							post_title: post.title,
							post_id: post._id
						}
					});
				});
				pushNotifications(notifications);
			});
			break;
	}
}

function pushNotifications(notifications) {
	Notification.create(notifications, function(err, $notifications) {
		if(err) return;
		if(_.isEmpty($notifications)) return;
		// emit event
		if(_.isArray($notifications)) {
			$notifications.forEach(function(notification) {
				if(!_.isEmpty(notification.user))
					emitter.emit(notification.user, notification);
			});
		} else {
			if(!_.isEmpty($notifications.user))
				emitter.emit($notifications.user, $notifications);
		}
	});
}
