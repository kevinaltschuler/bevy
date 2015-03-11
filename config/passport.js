'use strict';

var error = require('./../error');
var config = require('./../config');
var _ = require('underscore');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var bcrypt = require('bcryptjs');

var GOOGLE_CLIENT_ID = "997604872946-0dcs70i551uqkl4hi8e916grj654m93t.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "pVMflnd7ep-csuyw0RoOjE1R";

module.exports = function(app) {

	var User = mongoose.model('User');

	passport.use(new LocalStrategy({
			  usernameField: 'email'
			, passwordField: 'password'
		},
		function(email, password, done) {
			console.log('Authenticating user: ', email, password);
			var query = { email: email };
			User.findOne(query).exec(function(err, user) {
				if(err) return done(err);
				if(!user) {
					console.log('incorrect email');
					return done(null, false, { message: 'Incorrect email' });
				}
				var hash = user.password;
				if(!bcrypt.compareSync(password, hash)) {
					console.log('incorrect password');
					return done(null, false, { message: 'Incorrect password' });
				}
				console.log('User', email, 'authenticated!');
				return done(null, user);
			});
		}
	));

	passport.use(new GoogleStrategy({
			  clientID: GOOGLE_CLIENT_ID
			, clientSecret: GOOGLE_CLIENT_SECRET
			, callbackURL: config.app.server.hostname + '/auth/google/callback'
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ 'google.id': profile.id }, function (err, user) {
				if(err) return done(err);

				if(user) {
					return done(err, user);
				} else {
					console.log('user doesnt exist yet');
				}
			});
		}
	));


	passport.serializeUser(function(user, done) {
		if(!user) {
			console.log('no user passed to serialize func');
			//done('woops', null);
		} else {
			console.log('Serializing: ', user);
			done(null, user._id);
		}
	});

	passport.deserializeUser(function(id, done) {
		console.log('Deserializing: ', id);
		var query = { _id: id };
		User.findOne(query).exec(function(err, user) {
			if(err) done(err, null);
			else done(null, user);
		});
	});
}
