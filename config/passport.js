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
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

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

passport.serializeUser(function(user, done) {
  if(user)
    done(null, user._id);
});

passport.deserializeUser(function(user_id, done) {
  User.findOne({ _id: user_id }, function(err, user) {
    if(err) done(err, null);
    else done(null, user);
  })
  .populate({
    path: 'bevy',
    select: '_id name slug image boards admins subCount created settings'
  });
});
