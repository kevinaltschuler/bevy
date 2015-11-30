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

var GOOGLE_CLIENT_ID 
  = "540892787949-cmbd34cttgcd4mde0jkqb3snac67tcdq.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "TETz_3VIhSBbuQeTtIQFL3d-";

module.exports = function(app) {

  var User = mongoose.model('User');

  passport.use('login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if(err) return done(err);
        if(_.isEmpty(user)) 
          return done(null, false, { message: 'No User With That Username Exists' });

        var hash = user.password;
        if(bcrypt.compareSync(password, hash)) {
          // found it
          return done(null, user);
        }
        return done(null, false, { message: 'Incorrect password' });
      });
    }
  ));

  passport.use('switch', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    var user_id = req.body['user_id'];
    var switch_to_id = req.body['switch_to_id'];

    if(_.isEmpty(user_id) || _.isEmpty(switch_to_id)) 
      return done(null, false, { message: 'Invalid Credentials' });

    User.findOne({ _id: user_id }, function(err, user) {
      if(err) return done(err);
      if(_.isEmpty(user)) 
        return done(null, false, { message: 'User Does Not Exist' });
      var linkedAccounts = user.linkedAccounts;
      User.findOne({ _id: switch_to_id }, function(err, $user) {
        if(err) return done(err);
        if(_.isEmpty($user)) 
          return done(null, false, { message: 'Linked Account Does Not Exist' });
        if(!_.contains(linkedAccounts, $user._id)) 
          return done(null, false, { message: 'Account Not Linked' });
        return done(null, $user);
      });
    }).lean();
  }));

  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: config.app.server.hostname + '/auth/google/callback',
      realm: config.app.server.hostname
    },
    function(accessToken, refreshToken, profile, done) {
      var emails = _.pluck(profile.emails, 'value');

      var id_query = { 'google.id': profile.id };
      // match emails as well as id so we can prevent users from
      // having both an email account and a google account (confusing!)
      var email_query = { email: { $in: emails } };

      User.findOne({ $or: [ id_query, email_query ] }, function (err, user) {
        if(err) return done(err);
        if(user) {
          // user found
          if(_.isEmpty(user.google.emails)) {
            // google profile has not yet been set
            user.google = profile;
            if(profile.photos) {
              user.image = {
                filename: (profile.photos) ? profile.photos[0].value : undefined,
                foreign: true
              };
            }
            user.save(function(err) {
              if(err) return done(err);
              return done(null, user);
            });
          } else return done(null, user);
        } else {
          // user not found. let's create an account
          var defaultBevies = ('11sports 22gaming 3333pics '
            + '44videos 555music 6666news 777books').split(' ');
          User.create({
            _id: shortid.generate(),
            token: accessToken,
            image: {
              filename: (profile.photos) ? profile.photos[0].value : undefined,
              foreign: true
            },
            email: emails[0], // use the first email as default.
                              // let the user change this later
            google: profile,  // load the entire profile object into the 'google' object
            bevies: defaultBevies
          }, function(err, new_user) {
            if(err) return done(err);

            return done(null, new_user);
          });
        }
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    if(user)
      done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    var query = { _id: id };
    User.findOne(query).exec(function(err, user) {
      if(err) done(err, null);
      else done(null, user);
    });
  });
}
