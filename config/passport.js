'use strict';

var error = require('./../error');
var config = require('./../config');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var bcrypt = require('bcryptjs');

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

	passport.use(new GoogleStrategy({
		  	returnURL: config.app.server.hostname + '/auth/google/return'
			, realm: config.app.server.hostname
		},
		function(identifier, profile, done) {
			var query = { open_id: identifier };
			User.findOne(query).exec(function(err, user) {
				if(err) return done(err);
				if(!user) {
					// doesn't exist
					var new_user = {
						  _id: ObjectId()
						, open_id: identifier
					};
					User.create(new_user, function(err, user) {
						if(err) return done(err);
						done(err, user);
					});
				} else done(err, user);
			});
		}
	));

	passport.serializeUser(function(user, done) {
		console.log('Serializing: ', user);
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		console.log('Deserializing: ', id);
		var query = { _id: new ObjectId.createFromHexString(id) };
		User.findOne(query).exec(function(err, user) {
			done(err, user);
		});
	});
}
