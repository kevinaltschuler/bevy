'use strict';

var error = require('./../error');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google').Strategy;

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
//var User = mongoose.model('User');

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

	passport.serializeUser(function(user, done) {
		console.log('Serializing: ', user);
		done(null, user._id.toHexString());
	});

	passport.deserializeUser(function(id, done) {
		console.log('Deserializing: ', user);
		var query = { _id: new ObjectID.createFromHexString(id) };
		User.findOne(query).exec(function(err, user) {
			done(err, user);
		});
	});
}
