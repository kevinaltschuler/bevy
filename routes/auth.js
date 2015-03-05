'use strict';

var passport = require('passport');

module.exports = function(app) {

	app.get('/login', function(req, res, next) {
		res.render('login', {});
	});

	app.get('/register', function(req, res, next) {
		res.render('register', {});
	});

	app.post('/login',
		passport.authenticate('local', {
			  successRedirect: '/'
			, failureRedirect: '/login'
			, failureFlash: true
		})
	);

	app.get('/auth/google', passport.authenticate('google'));

	app.get('/auth/google/return',
		passport.authenticate('google', {
			  successRedirect: '/'
			, failureRedirect: '/login'
		})
	);

}
