/**
 * mubsub.js
 *
 * create the mubsub client
 * and expose it for public consumption
 *
 * also serves as a message queue/handler
 *
 * @author albert
 */

'use strict';

var async = require('async');
var mubsub = require('mubsub');
var mongoose = require('mongoose');
var mailgun = require('./config/mailgun')();

var User = mongoose.model('User');

var client;

exports.connect = function(db) {
	client = mubsub(db);

	// create channels
	var channel = client.channel('notifications');

	channel.subscribe('test', function(options) {
		console.log(options.message);
	});

	channel.subscribe('invite:email', function(options) {

		//console.log(options);
		//var email = options.email;
		var members = options.members;
		var bevy = options.bevy;
		var inviter = options.user;

		members.forEach(function(email) {
			async.waterfall([
				function(done) {
					// push the notification object onto a matching user
					var query = { email: email };
					var promise = User.findOne(query).exec();
					promise.then(function(user) {
						user.notifications.push({
						 	event: 'invite',
							data: {
								bevy: bevy,
								from_user: inviter
							}
						});
						user.save(function(err) {
							if(err) return done(err);
							done(null);
						});
					}, function(err) {
						return done(err);
					});
				},

				function(done) {
					// then send the invite email
					mailgun.messages().send({
						from: 'Bevy Team <contact@bvy.io>',
						to: email,
						subject: 'Invite',
						text: 'Invite to ' + bevy.name + ' from ' + inviter.google.name.givenName + ' ' + inviter.google.name.familyName
					}, function(err, body) {
						if(err) {
							return done(err);
						}
						console.log(body);
					});
				}
			]);
		});
	});

	//channel.publish('test', 'foobar');
}

//exports.client = client;
//exports.notification_channel = client.channel('notifications');
exports.client = function() {
	return client;
}



