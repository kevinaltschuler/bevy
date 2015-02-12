'use strict';

var passport = require('passport');

module.exports = function(app) {

	app.get('/login', function(req, res, next) {
		res.render('login', {});
	});

	app.post('/login',
		passport.authenticate('local', {
			  successRedirect: '/'
			, failureRedirect: '/login'
			, failureFlash: true
		})
	);

}
