'use strict';

var passport = require('passport');
var mailgun = require('./../config').mailgun();

var client = require('./../mubsub').client();
//var channel = require('./../mubsub').notification_channel;
var channel = client.channel('notifications');

module.exports = function(app) {

	//test email
	app.get('/emailtest', function(req, res, next) {
		mailgun.messages().send({
			from: 'Bevy Team <contact@bvy.io>',
			to: 'blahoink@gmail.com',
			subject: 'Test Subject',
			text: 'Test Body'
		}, function(error, body) {
			res.json(body);
		});
	});

	/*app.get('/notificationtest', function(req, res, next) {
		channel.publish('test', { nuts: 'are big' });
	});*/


	// for everything else - pass it off to the react router
	// on the front end
	// this should be the last route ever checked
	// TODO: do this smartly with a regex
	// TODO: support for hashes and non-pushstates
	app.get('/**', require_user, function(req, res, next) {
		res.render('app', {
			env: process.env.NODE_ENV,
			user: req.user
		});
	});
}

function require_user(req, res, next) {
	if(req.user) {
		//console.log(req.user);
		next();
	}
	else {
		res.redirect('/login');
	}
	//next();
}
