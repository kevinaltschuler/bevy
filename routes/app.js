'use strict';

var passport = require('passport');

module.exports = function(app) {
	app.get('/', require_user, function(req, res, next) {
		res.render('app', { env: process.env.NODE_ENV });
	});
}

function require_user(req, res, next) {
	if(req.user) {
		console.log(req.user);
		next();
	}
	else {
		res.redirect('/login');
	}
	//next();
}
