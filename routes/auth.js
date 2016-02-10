/**
 * auth.js
 * @author albert
 */

'use strict';

var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');

var passport = require('passport');
var error = require('./../error');
var config = require('./../config');
var mailgun = require('./../config').mailgun();

var mongoose = require('mongoose');
var User = require('./../models/User');
var ResetToken = require('./../models/ResetToken');

var oauth2Controller = require('./../controllers/oauth2');
var emailController = require('./../controllers/email');
var viewController = require('./../controllers/views');

module.exports = function(app) {

  app.post('/token', oauth2Controller.token);
  app.post('/login', oauth2Controller.loginUsername);

  app.get('/logout', function(req, res, next) {
    // weren't logged in in the first place
    //if(!req.user) res.redirect('/login');

    req.logout();
    res.redirect('/');
  });

  app.post('/forgot', function(req, res, next) {
    // collect email
    var email = req.body['email'];
    if(!email) { next(error.gen('Email not supplied')); }

    async.waterfall([
      function(done) {
        // find user with that email
        var query = { email: email };
        User.findOne(query, function(err, user) {
          if(err) { return next(err); }
          if(!user) { return next(error.gen('User not found')); }

          done(null, user);
        });
      },
      function(user, done) {
        // create token string
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token, user);
        });
      },
      function(token, user, done) {
        // create reset token
        ResetToken.create({
            user: user
          , token: token
        }, function(err, resetToken) {
          done(err, resetToken, user);
        });
      },
      function(resetToken, user, done) {
        // send email
        mailgun.messages().send({
          from: 'Bevy Team <contact@joinbevy.com>',
          to: email,
          subject: 'Reset Password',
          text: 'Heres your link: ' + config.app.server.hostname + '/reset/' + resetToken.token
        }, function(err, body) {
          if(err) return next(err);
          //console.log(body);
          return res.json(body);
        });
      }
    ]);
  });

  app.post('/reset/:token', checkToken, function(req, res, next) {
    // then collect password params
    var password = req.body['password'];
    if(!password) return next(error.gen('Password not supplied'));

    async.waterfall([
      // find the user whose password is being changed
      function(done) {
        User.findOne({ _id: req.resetTokenUser }, function(err, user) {
          if(err) return done(err);
          if(_.isEmpty(user)) return done('User not found');

          return done(null, user);
        })
        .populate({
          path: 'bevy',
          select: '_id name slug'
        });
      },
      // change fields and flush user to db
      function(user, done) {
        user.password = bcrypt.hashSync(password, 8);
        user.updated = Date.now();
        user.save(function(err) {
          if(err) return done(err);
          return done(null, user);
        });
      },
      // send confirmation email
      function(user, done) {
        emailController.sendEmail(user.email, 'reset-pass-confirmation', {
          user_email: user.email,
          user_username: user.username
        }, function(err, results) {
          // dont break out if this fails. its ok
          if(err) console.log(err);
          return done(null, user);
        });
      },
      // delete reset token
      function(user, done) {
        ResetToken.findOneAndRemove({ token: req.params.token }, function(err, token) {
          if(err) return done(err);
          return done(null, user);
        });
      }
    ], function(err, result) {
      if(err) return next(err);
      return res.json(result);
    });
});

  app.get('/reset/:token', checkToken, viewController.renderApp);
}

function checkToken(req, res, next) {
  var token = req.params.token;
  var query = { token: token };
  ResetToken.findOne(query, function(err, token) {
    if(err) return next(err);
    if(!token) {
      // token not found
      console.log('token not found');
      return res.redirect('/login');
    }
    req.resetTokenUser = token.user;
    return next();
  });
}
