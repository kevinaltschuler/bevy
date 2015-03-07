'use strict';

var passport = require('passport');

module.exports = function(app) {

	app.get('/login', function(req, res, next) {
		res.render('app', {
			env: process.env.NODE_ENV
		});
	});
	app.get('/register', function(req, res, next) {
		res.render('app', {
			env: process.env.NODE_ENV
		});
	});

	// for everything else - pass it off to the react router
	// on the front end
	// this should be the last route ever checked
	// TODO: do this smartly with a regex
	app.get('/**', require_user, function(req, res, next) {
		res.render('app', {
			  env: process.env.NODE_ENV
			, user: req.user
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
