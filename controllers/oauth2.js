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
var async = require('async');

var User = require('./../models/User');
var Bevy = require('./../models/Bevy');
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
  var bevy_slug = (req.subdomains.length == 1) ? req.subdomains[0] : null;

  // only allow signing into a bevy directly.
  if(!bevy_slug) {
    return next('Must log in from a bevy subdomain')
  }

  async.waterfall([
    // find the corresponding bevy (to the given subdomain/slug)
    function(done) {
      Bevy.findOne({ slug: bevy_slug }, function(err, bevy) {
        if(err) return done(err);
        // make sure the bevy we're signing into exists
        if(!bevy) return done('Bevy with the subdomain ' + bevy_slug + ' not found');
        // bevy found, move on
        return done(null, bevy);
      });
    },
    // find the user and verify the password
    function(bevy, done) {
      // find a user where their username matches either a username or an email
      // within the specified bevy
      var query = {
        $and: [
          { $or: [
            { email: username },
            { username: username }
          ]},
          { bevy: bevy._id }
        ]
      };
      // send the db reqeust
      User.findOne(query, function(err, user) {
        if(err) return done(err);
        // if the email doesn't match a user, then let the user know
        if(!user) return done('User with that email address not found');
        // make sure password matches
        if(!user.verifyPassword(password)) return done('Email and password combination do not match');
        // move on
        return done(null, user);
      });
    },
    // generate oauth2 tokens
    function(user, done) {
      // generate new access and refresh tokens
      generateTokens(
        user, // the user object
        req['user'], // the client object (stored in user for some reason)
        // and the callback
        function(err, accessToken, refreshToken, data) {
          if(err) return done(err);
          else return done(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user.toJSON(),
            expires_in: data['expires_in']
          });
        }
      );
    },
    // log the user into passport
    function(results, done) {
      // clear serialized client
      //req.logout();
      // serialize user into session
      // and pass access & refresh tokens for the client
      // also give client expiration date so it can request new token by itself
      req.logIn(results.user, function(err) {
        if(err) return done(err);
        else return done(null, results);
      });
    }
  ], function(err, result) {
    // 500 any errors inside the watefall functions
    if(err) return next(err);
    // else return the tokens and signed in user
    else return res.json(result);
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
