'use strict';

var passport = require('passport');

module.exports = function(app) {

	//app.get('/login', function(req, res, next) {
	//	res.render('login', { env: process.env.NODE_ENV });
	//});

	//app.get('/register', function(req, res, next) {
	//	res.render('register', { env: process.env.NODE_ENV });
	//});

	app.post('/login',
		passport.authenticate('local', {
			  successRedirect: '/'
			, failureRedirect: '/login'
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
