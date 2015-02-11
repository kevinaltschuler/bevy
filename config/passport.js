'use strict';

var error = require('./../error');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
//var User = mongoose.model('User');

module.exports = function(app, User) {

	passport.use(new LocalStrategy({
			  usernameField: 'email'
			, passwordField: 'password'
		},
		function(email, password, done) {
			var query = { email: email };
			User.findOne(query).exec(function(err, user) {
				if(err) return done(err);
				if(!user) {
					return done(null, false, { message: 'Incorrect email' });
				}
				var hash = user.password;
				if(!bcrypt.compareSync(password, hash)) {
					//fail
					return done(null, false, { message: 'Incorrect password' });
				}
				return done(null, user);
			});
		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(_id, done) {
		var query = { _id: _id };
		User.findOne(query).exec(function(err, user) {
			done(err, user);
		});
	});

	app.post('/login',
		passport.authenticate('local', {
			  successRedirect: '/'
			, failureRedirect: '/login'
			, failureFlash: true
		})
	);
}
