/**
 * oauth2.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');
var config = require('./../config');
var error = require('./../error');
var shortid = require('shortid');

var User = require('./../models/User');
var AccessToken = require('./../models/AccessToken');
var RefreshToken = require('./../models/RefreshToken');

var permissionsController = require('./permissions');

var server = oauth2orize.createServer();

// Generic error handler
var errFn = function(cb, err) {
  if(err) return cb(err);
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function(user, client, done) {
	// curries in `done` callback so we don't need to pass it
  var errorHandler = errFn.bind(undefined, done);

  // remove expired/existing tokens
  RefreshToken.remove({ user_id: user._id, client_id: client.client_id }, errorHandler);
  AccessToken.remove({ user_id: user._id, client_id: client.client_id }, errorHandler);

  // generate new token values
  var accessTokenValue = crypto.randomBytes(32).toString('hex');
  var refreshTokenValue = crypto.randomBytes(32).toString('hex');

  // create new access and refresh tokens
  var accessToken = new AccessToken({
    token: accessTokenValue,
    user_id: user._id,
    client_id: client.client_id
  });
  var refreshToken = new RefreshToken({
    token: refreshTokenValue,
    user_id: user._id,
    client_id: client.client_id
  });
  // save tokens to db
  refreshToken.save(errorHandler);
  accessToken.save(function(err) {
  	if(err) return done(err);
    // bubble up to token exchange middleware
  	done(null, accessTokenValue, refreshTokenValue, {
  		'expires_in': config.auth.expiresIn.seconds
  	});
  });
};

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(
  function(client, refreshToken, scope, done) {
    RefreshToken.findOne({ token: refreshToken, client_id: client.client_id }, function(err, token) {
    	if(err) return done(err);
    	if(!token) return done(null, false);

    	User.findOne({ _id: token.user_id }, function(err, user) {
    		if (err) return done(err);
    		if (!user) return done(null, false);
    		generateTokens(user, client, done);
    	});
    });
  }
));

var loginUsername = function(req, res, next) {
  var username = req.body['username'];
  var password = req.body['password'];
  User.findOne({ $or: [{ username: username }, { email: username }] }, function(err, user) {
    if(err) return next(err);
    if(!user) return next('User not found');
    // make sure password matches
    if(!user.verifyPassword(password)) return next('Invalid credentials');

    // generate new access and refresh tokens
    generateTokens(user, req['user'], function(err, accessToken, refreshToken, data) {
      if(err) return next(err);
      // clear serialized client
      //req.logout();
      // serialize user into session
      // and pass access & refresh tokens for the client
      // also give client expiration date so it can request new token by itself
      req.logIn(user, function(err) {
        if(err) return next(err);
        return res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: user.toJSON(),
          expires_in: data['expires_in']
        });
      });
    });
  });
};

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
	passport.authenticate(['client-password'], { session: false }),
	server.token(),
	server.errorHandler()
];

exports.loginUsername = [
  passport.authenticate(['client-password'], { session: false }),
  loginUsername,
  error.error_handler
];

// bearer endpoint
exports.bearer = [
  function(req, res, next) {
    if(permissionsController.checkBackdoor(req)) return next();
    passport.authenticate(['bearer'], { session: false })(req, res, next);
  }
];

passport.serializeUser(function(user, done) {
  if(user)
    done(null, user._id);
});

passport.deserializeUser(function(user_id, done) {
  User.findOne({ _id: user_id }, function(err, user) {
    if(err) done(err, null);
    else done(null, user);
  });
});
