'use strict';

var passport = require('passport');
var error = require('./../error');

module.exports = function(app) {

	/*app.post('/login',
		passport.authenticate('local', {
			  successRedirect: '/'
			, failureRedirect: '/login'
		})
	);*/
	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			// a passport or database error
			if (err) { return next(err); }

			// user not found
			if (!user) {
				// return error message set by
				// /config/passport.js
				//return res.json(info);
				next(error.gen(info.message));
			}

			// log in
			req.logIn(user, function(err) {
				if (err) return next(err);
				// user found
				return res.json(user);
			});
		})(req, res, next);
	});

	app.get('/logout', function(req, res, next) {
		// weren't logged in in the first place
		//if(!req.user) res.redirect('/login');

		req.logout();
		res.redirect('/login');
	});

	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile', 'email']
	}));

	app.get('/auth/google/callback',
		passport.authenticate('google', {
			  failureRedirect: '/login'
			, successRedirect: '/'
		}
	));

}
