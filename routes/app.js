'use strict';

var passport = require('passport');
var mailgun = require('./../config').mailgun();
var template = require('./../public/html/email/template.jsx')('nuts', 'kevin');
var async = require('async');
var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(app) {

	var emailHTML = template;

	//test email
	app.get('/emailtest', function(req, res, next) {
		mailgun.messages().send({
			from: 'Bevy Team <contact@bvy.io>',
			to: 'kevin@joinbevy.com',
			subject: 'Test Subject',
			html: emailHTML
		}, function(error, body) {
			res.json(body);
		});
	});

	app.post('/feedback', function(req, res, next) {

		var name = req.body['name'] || 'Anonymous';
		var body = req.body['body'] || '';

		mailgun.messages().send({
			from: name + ' <contact@joinbevy.com>',
			to: 'contact@joinbevy.com',
			subject: 'Feedback',
			text: body
		}, function(error, body) {
			res.json(body);
		});
	});


	var Bevy = mongoose.model('Bevy');
	var Notification = mongoose.model('Notification');
	var Post = mongoose.model('Post');
	var Comment = mongoose.model('Comment');
	var Thread = mongoose.model('ChatThread');
	var Message = mongoose.model('ChatMessage');
	var Member = mongoose.model('BevyMember');

	// for everything else - pass it off to the react router
	// on the front end
	// this should be the last route ever checked
	app.get('/**', function(req, res, next) {

		if(_.isEmpty(req.user)) {
			res.render('app', {
				env: process.env.NODE_ENV,
				hostname: req.hostname,
				user: {}
			});
		} else {
			// try to get as much stuff as possible
			// so we don't have to ajax for it later
			var user = req.user;

			async.parallel([
				function(callback) {
					// get bevies
					Member.find({ user: user._id }, function(err, members) {
						if(err) return next(err);
						var _bevies = [];
						async.each(members, function(member, callback) {
							if(_.isEmpty(member.bevy)) {
								return;
							}
							var bevy_id = member.bevy._id;
							var bevy = JSON.parse(JSON.stringify(member.bevy));
							Member.find({ bevy: bevy_id }, function(err, $members) {
								bevy.members = $members;
								_bevies.push(bevy);
								callback();
							}).populate('user');
						}, function(err) {
							if(err) return next(err);
							callback(null, _bevies);
						});
					}).populate('bevy');
				},
				function(callback) {
					// get notifications
					Notification.find({ user: user._id }, function(err, notifications) {
						if(err || _.isEmpty(notifications)) return callback(null, []);
						callback(null, notifications);
					});
				},
				function(callback) {
					var path = req.path;
					var postRegex = /(?:b)\/(.{1,24})(?:(?:\/post)(?:.+))?/;
					var $bevy_id = path.match(postRegex);
					var bevy_id;
					if($bevy_id == null) return callback(null, []);
					else bevy_id = $bevy_id[1];

					if(bevy_id == 'frontpage') {
						// get frontpage posts
						async.waterfall([
							function(done) {
								Member.find({ user: user._id }, function(err, members) {
									if(err) return callback(null, []);
									var _bevies = [];
									async.each(members, function(member, $callback) {
										_bevies.push(member.bevy);
										$callback();
									}, function(err) {
										if(err) return callback(null, []);
										done(null, _bevies);
									});
								}).populate('bevy');
							},
							function(bevies, done) {
								var bevy_id_list = _.pluck(bevies, '_id');
								var post_query = { bevy: { $in: bevy_id_list } };
								var post_promise = Post.find(post_query)
									.populate('author')
									.exec();
								post_promise.then(function(posts) {
									done(null, posts);
								}, function(err) { return callback(null, []); });
							},
							function(posts, done) {

								if(posts.length <= 0) return callback(null, []);

								var _posts = [];

								posts.forEach(function(post) {
									Comment.find({ postId: post._id }, function(err, comments) {
										post = post.toObject();
										post.comments = comments;
										_posts.push(post);
										if(_posts.length == posts.length) return callback(null, _posts);
									}).populate('author');
								});
							}
						]);
					} else {
						// get bevy posts
						async.waterfall([
							function(done) {
								Member.find({ user: user._id }, function(err, members) {
									if(err) return callback(null, []);
									var _bevies = [];
									async.each(members, function(member, $callback) {
										_bevies.push(member.bevy);
										$callback();
									}, function(err) {
										if(err) return callback(null, []);
										var bevy_id_list = _.map(_bevies, function(bevy) {
											return bevy._id.toString();
										});
										if(bevy_id_list.indexOf(bevy_id) > -1) {
											done(null);
										} else return callback(null, []);
										//done(null, _bevies);
									});
								}).populate('bevy');
							},
							function(done) {
								var promise = Post.find({ bevy: bevy_id }, function(err, posts) {
									if(err) return callback(null, []);
									if(posts.length <= 0) return callback(null, []);
									var _posts = [];
									posts.forEach(function(post) {
										var comment_promise = Comment.find({ postId: post._id }, function(err, comments) {
											if(err) return callback(null, []);
											post = post.toJSON();
											post.comments = comments;
											_posts.push(post);
											if(_posts.length == posts.length) return callback(null, _posts);
										}).populate('author');
									});
								}).populate('author');
							}
						]);
					}
				},
				function(callback) {
					// get threads
					async.waterfall([
						function(done) {
							Member.find({ user: user._id }, function(err, members) {
								if(err) return callback(null, []);
								var _bevies = [];
								async.each(members, function(member, $callback) {
									_bevies.push(member.bevy);
									$callback();
								}, function(err) {
									if(err) return callback(null, []);
									done(null, _bevies);
								});
							}).populate('bevy');
						},
						function(bevies, done) {
							var bevy_id_list = _.pluck(bevies, '_id');

							Thread.find(function(err, threads) {
								if(err) return callback(null, []);
								return callback(null, threads);
							}).or([{ members: { $elemMatch: { user: user._id } } }, { bevy: { $in: bevy_id_list } }])
							.populate('bevy members.user members.member');
						}
					]);
				}
			], function(err, results) {
				var bevies =  results[0];
				var notifications = results[1];
				var posts = results[2];
				var threads = results[3];

				return res.render('app', {
					env: process.env.NODE_ENV,
					hostname: req.hostname,
					user: user,
					bevies: bevies,
					notifications: notifications,
					posts: posts,
					threads: threads
				});
			});
		}
	});
}
