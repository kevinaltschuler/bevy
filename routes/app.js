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

	// for everything else - pass it off to the react router
	// on the front end
	// this should be the last route ever checked
	app.get('/*', function(req, res, next) {

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
					Bevy.find({ members: { $elemMatch: { user: user._id } } }, function(err, bevies) {
						if(err || _.isEmpty(bevies)) return callback(null, []);
						callback(null, bevies);
					}).populate('member.user');
				},
				function(callback) {
					// get notifications
					Notification.find({ user: user._id }, function(err, notifications) {
						if(err || _.isEmpty(notifications)) return callback(null, []);
						callback(null, notifications);
					});
				}
			], function(err, results) {
				var bevies =  results[0];
				var notifications = results[1];

				res.render('app', {
					env: process.env.NODE_ENV,
					hostname: req.hostname,
					user: user,
					bevies: bevies,
					notifications: notifications
				});
			});
		}
	});
}
