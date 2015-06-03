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

	switch(params.event) {
		case 'test':
			//console.log(params);
			break;
		case 'invite:email':
			var members = params.members;
			//var bevy = params.bevy;
			//var inviter = params.user;
			var bevy_id = req.body['bevy_id'];
			var bevy_name = req.body['bevy_name'];
			var bevy_img = req.body['bevy_img'];
			var inviter_name = req.body['inviter_name'];

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
									bevy_id: bevy_id,
									bevy_name: bevy_name,
									bevy_img: bevy_img,
									inviter_name: inviter_name
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

						mailgun.messages().send({
							from: 'Bevy Team <contact@joinbevy.com>',
							to: email,
							subject: 'Invite',
							text: 'Invite to ' + bevy_name + ' from ' + inviter_name
						}, function(err, body) {
							if(err) {
								return done(err);
							}
						});
					}
				]);
			});

			break;

		case 'post:create':
			//var post = req.body['post'];
			var author_name = req.body['author_name'];
			var author_img = req.body['author_img'];
			var bevy_name = req.body['bevy_name'];
			var bevy_members = req.body['bevy_members'];
			var post_title = req.body['post_title'];
			//console.log(post);
			var members = [];
			members = _.filter(bevy_members, function(member) {
				return member.notificationLevel == 'all';
			});

			members.forEach(function(member) {
				if(_.isEmpty(member.user)) return; // user hasn't joined yet, so continue
				var user_query = { _id: member.user };
				var user_promise = User.findOne(user_query).exec();
				user_promise.then(function(user) {
					if(!user) return next(err);
					var notification = {
						event: 'post:create',
						data: {
							// post: post,
							author_name: author_name,
							author_img: author_img,
							bevy_name: bevy_name,
							post_title: post_title
						}
					};
					user.notifications.push(notification);
					user.save(function(err, $user) {
						if(err) return next(err);
						emitter.emit('post:create:' + user._id, $user.notifications.toObject()[$user.notifications.length - 1]);
					});
				}, function(err) { return next(err); })
			});

			break;

		case 'bevy:requestjoin':

			var bevy_id = req.body['bevy_id'];
			var bevy_members = req.body['bevy_members'];
			var bevy_name = req.body['bevy_name'];
			var user_id = req.body['user_id'];
			var user_name = req.body['user_name'];
			var user_image = req.body['user_image'];
			var user_email = req.body['user_email'];

			var admins = _.where(bevy_members, { role: 'admin' });
			admins.forEach(function(admin) {
				var admin_query = { _id: admin.user };
				var admin_promise = User.findOne(admin_query).exec();
				admin_promise.then(function(user) {
					var notification = {
						event: 'bevy:requestjoin',
						data: {
							bevy_id: bevy_id,
							bevy_name: bevy_name,
							user_id: user_id,
							user_name: user_name,
							user_image: user_image,
							user_email: user_email
						}
					};
					user.notifications.push(notification);
					user.save(function(err, $user) {
						if(err) return next(err);
						emitter.emit('bevy:requestjoin:' + user._id, $user.notifications.toObject()[$user.notifications.length - 1]);
					});
				}, function(err) { return next(err) });
			});

			break;

		case 'comment:create':
			var author_id = req.body['author_id'];
			var author_name = req.body['author_name'];
			var author_image = req.body['author_image'];
			var post_id = req.body['post_id'];
			var post_title = req.body['post_title'];
			var post_author_id = req.body['post_author_id'];
			var bevy_name = req.body['bevy_name'];
			var bevy_members = req.body['bevy_members'];

			// send reply notification to post author
			//	get member - match post author id
			var post_author_member = _.findWhere(bevy_members, { user: post_author_id });
			// check if notification level is 'my' or 'all'
			if(post_author_member.notificationLevel == 'none') {
			} else {
				// send reply notification
				User.findOne({ _id: post_author_id }, function(err, user) {
					var notification = {
						event: 'post:reply',
						data: {
							author_name: author_name,
							author_image: author_image,
							post_title: post_title,
							bevy_name: bevy_name
						}
					};
					user.notifications.push(notification);
					user.save(function(err, $user) {
						if(err) return next(err);
						emitter.emit('post:reply:' + user._id, $user.notifications.toObject()[$user.notifications.length - 1]);
					});
				});
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
						// TODO: (see if they muted the post)
						// check if notification level is 'none'
						if(commentator_member.notificationLevel == 'none') {
							return;
						} else {
							// send commented notification
							User.findOne({ _id: commentator }, function(err, user) {
								var notification = {
									event: 'post:commentedon',
									data: {
										author_name: author_name,
										author_image: author_image,
										post_title: post_title,
										bevy_name: bevy_name
									}
								};
								user.notifications.push(notification);
								user.save(function(err, $user) {
									if(err) return next(err);
									emitter.emit('post:commentedon:' + user._id, $user.notifications.toObject()[$user.notifications.length - 1]);
									done(null);
								});
							});
						}
					});
				}
			]);

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
		if(!res.headersSent)
			return res.json(invite);
		else return next();
	});
	emitter.on('post:create:' + user_id, function(data) {
		if(!res.headersSent)
			return res.json(data);
		else return next();
	});
	emitter.on('post:reply:' + user_id, function(data) {
		if(!res.headersSent)
			return res.json(data);
		else return next();
	});
	emitter.on('post:commentedon:' + user_id, function(data) {
		if(!res.headersSent)
			return res.json(data);
		else return next();
	});
	emitter.on('bevy:requestjoin:' + user_id, function(data) {
		if(!res.headersSent)
			return res.json(data);
		else return next();
	});
}
