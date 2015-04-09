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

var GOOGLE_CLIENT_ID = "540892787949-cmbd34cttgcd4mde0jkqb3snac67tcdq.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "TETz_3VIhSBbuQeTtIQFL3d-";

module.exports = function(app) {

	var User = mongoose.model('User');

	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password'
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
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: config.app.server.hostname + '/auth/google/callback',
			realm: config.app.server.hostname
		},
		function(accessToken, refreshToken, profile, done) {
			console.log('Authenticating user: ', profile.emails[0]);
			var emails = _.pluck(profile.emails, 'value');

			var id_query = { 'google.id': profile.id };
			// match emails as well as id so we can prevent users from
			// having both an email account and a google account (confusing!)
			var email_query = { email: { $in: emails } };

			User.findOne({ $or: [ id_query, email_query ] }, function (user) {
				if(user) {
					// user found
					console.log('User', emails[0], 'already exists! Logging in...');
					if(_.isEmpty(user.google.emails)) {
						// google profile has not yet been set
						console.log('setting users google profile');
						user.google = profile;
						user.save(function(err) {
							if(err) return done(err);
							return done(null, user);
						});
					} else return done(null, user);
				} else {
					// user not found. let's create an account
					console.log('User', emails[0], 'doesnt exist. Creating new user...');
					User.create({
						token: accessToken,
						email: emails[0], // use the first email as default.
												 // let the user change this later
						google: profile // load the entire profile object into the 'google' object
					}, function(err, new_user) {
						if(err) return done(err);

						return done(null, new_user);
					});
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
