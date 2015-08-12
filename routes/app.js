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
			//console.log(user);

			async.parallel([
				function(callback) {
					// get bevies
					Bevy.find({ _id: { $in: user.bevies } }, function(err, bevies) {
						if(err) return callback(null, []);
						callback(null, bevies);
					});
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
								User.findOne({ _id: user._id }, function(err, user) {
									if(err) return callback(null, []);
									done(null, user.bevies);
								});
							},
							function(bevies, done) {
								var post_query = { bevy: { $in: bevies } };
								var post_promise = Post.find(post_query)
									.populate('bevy author')
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
						}).populate('bevy author');
					}
				},
				function(callback) {
					// get threads
					async.waterfall([
						function(done) {
							User.findOne({ _id: user._id }, function(err, user) {
								if(err) return callback(null, []);
								return done(null, user.bevies);
							});
						},
						function(bevies, done) {
							Thread.find(function(err, threads) {
								if(err) return callback(null, []);
								return callback(null, threads);
							}).or([{ users: user._id }, { bevy: { $in: bevies } }])
							.populate('bevy users');
						}
					]);
				}
			], function(err, results) {
				var bevies = results[0];
				var notifications = results[1];
				var posts = results[2];
				var threads = results[3];

				return res.render('app', {
					env: process.env.NODE_ENV,
					hostname: req.hostname,
					user: user,
					myBevies: bevies,
					notifications: notifications,
					posts: posts,
					threads: threads
				});
			});
		}
	});
}
