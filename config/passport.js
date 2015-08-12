/**
 * passport.js
 * @author albert
 */

'use strict';

var error = require('./../error');
var config = require('./../config');
var _ = require('underscore');

var passport = require('passport');
var shortid = require('shortid');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var GOOGLE_CLIENT_ID = "540892787949-cmbd34cttgcd4mde0jkqb3snac67tcdq.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "TETz_3VIhSBbuQeTtIQFL3d-";

module.exports = function(app) {

  var User = mongoose.model('User');

  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.find({ username: username }, function(err, users) {
        if(err) return done(err);
        if(users.length <= 0) return done(null, false, { message: 'No User With That Username Exists' });
        users.forEach(function(user) {
          var hash = user.password;
          if(bcrypt.compareSync(password, hash)) {
            // found it
            return done(null, user);
          }
        });
        return done(null, false, { message: 'Incorrect password' });
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
      //console.log('Authenticating user: ', profile.emails[0]);
      var emails = _.pluck(profile.emails, 'value');

      var id_query = { 'google.id': profile.id };
      // match emails as well as id so we can prevent users from
      // having both an email account and a google account (confusing!)
      var email_query = { email: { $in: emails } };

      User.findOne({ $or: [ id_query, email_query ] }, function (err, user) {
        if(err) return done(err);
        if(user) {
          // user found
          //console.log('User', emails[0], 'already exists! Logging in...');
          if(_.isEmpty(user.google.emails)) {
            // google profile has not yet been set
            //console.log('setting users google profile');
            user.google = profile;
            if(profile.photos) {
              user.image_url = user.google.photos[0].value;
            }
            user.save(function(err) {
              if(err) return done(err);
              return done(null, user);
            });
          } else return done(null, user);
        } else {
          // user not found. let's create an account
          //console.log('User', emails[0], 'doesnt exist. Creating new user...');
          User.create({
            _id: shortid.generate(),
            token: accessToken,
            image_url: (profile.photos) ? profile.photos[0].value : undefined,
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
    } else {
      done(null, user._id);
    }
  });

  passport.deserializeUser(function(id, done) {
    var query = { _id: id };
    User.findOne(query).exec(function(err, user) {
      if(err) done(err, null);
      else done(null, user);
    });
  });
}
