'use strict';

var passport = require('passport');
var mailgun = require('./../config').mailgun();
var template = require('./../public/html/email/template.jsx')('nuts', 'kevin');

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


	// for everything else - pass it off to the react router
	// on the front end
	// this should be the last route ever checked
	// TODO: do this smartly with a regex
	// TODO: support for hashes and non-pushstates
	app.get('/*', function(req, res, next) {
		res.render('app', {
			env: process.env.NODE_ENV,
			hostname: req.hostname,
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
