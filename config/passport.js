/**
 * passport.js
 * @author albert
 * @flow
 */

'use strict';

var error = require('./../error');
var config = {
  app: require('./app'),
  auth: require('./auth')
};
var _ = require('underscore');

var passport = require('passport');
var shortid = require('shortid');
//var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var GOOGLE_CLIENT_ID
  = "540892787949-cmbd34cttgcd4mde0jkqb3snac67tcdq.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "TETz_3VIhSBbuQeTtIQFL3d-";

var FACEBOOK_CLIENT_ID = "927226700679700";
var FACEBOOK_CLIENT_SECRET = "35742f9cad3c1ae06b06301cacc8c089";

var User = require('./../models/User');
var Client = require('./../models/Client');
var AccessToken = require('./../models/AccessToken');
var RefreshToken = require('./../models/RefreshToken');

/*passport.use('basic', new BasicStrategy(
  function(client_id, secret, done) {
    Client.findOne({ client_id: client_id }, function(err, client) {
      if(err) return done(err);
      // client not found
      if (!client) return done(null, false);
      // secret key doesnt match
      if (client.secret !== secret) return done(null, false);
      // success
      return done(null, client);
    });
  }
));*/

passport.use('client-password', new ClientPasswordStrategy(
  function(client_id, secret, done) {
    Client.findOne({ client_id: client_id }, function(err, client) {
      if(err) return done(err);
      // client not found
      if (!client) return done(null, false);
      // secret key doesn't match
      if (client.secret !== secret) return done(null, false);
      // success
      return done(null, client);
    });
  }
));

passport.use('bearer', new BearerStrategy(
  function(accessToken, done) {
    AccessToken.findOne({ token: accessToken }, function(err, token) {
      if(err) return done(err);
      if(!token) return done(null, false);

      if(Math.round((Date.now()-token.created)/1000) > config.auth.expiresIn.seconds) {
        AccessToken.remove({ token: accessToken }, function(err) {
          if(err) return done(err);
        });
        return done(null, false, { message: 'Token expired' });
      }

      User.findOne({ _id: token.user_id }, function(err, user) {
        if(err) return done(err);
        if(!user) return done(null, false, { message: 'User Not Found' });
        var info = { scope: '*' };
        done(null, user, info);
      });
    });
  }
));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: config.app.server.hostname + '/auth/facebook/callback'
},
function(accessToken, refreshToken, profile, done) {
  var emails = _.pluck(profile.emails, 'value');
  User.findOne({ $or: [{'facebook.id': profile.id }, { email: { $in: emails } }]}, function(err, user) {
    if(err) return done(err);
    if(user) {
      // user found
      if(_.isEmpty(user.facebook.emails)) {
        // google profile has not yet been set
        user.facebook = profile;
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
      User.create({
        _id: shortid.generate(),
        image: {
          filename: (profile.photos) ? profile.photos[0].value : undefined,
          foreign: true
        },
        email: emails[0], // use the first email as default.
                          // let the user change this later
        facebook: profile,  // load the entire profile object into the 'google' object
        bevies: [],
        boards: []
      }, function(err, new_user) {
        if(err) return done(err);
        return done(null, new_user);
      });
    }
  });
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
        User.create({
          _id: shortid.generate(),
          image: {
            filename: (profile.photos) ? profile.photos[0].value : undefined,
            foreign: true
          },
          email: emails[0], // use the first email as default.
                            // let the user change this later
          google: profile,  // load the entire profile object into the 'google' object
          bevies: [],
          boards: []
        }, function(err, new_user) {
          if(err) return done(err);

          return done(null, new_user);
        });
      }
    });
  }));
