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
var Bevy = require('./../models/Bevy');
var ResetToken = require('./../models/ResetToken');
var InviteToken = require('./../models/InviteToken');

var oauth2Controller = require('./../controllers/oauth2');
var emailController = require('./../controllers/email');
var viewController = require('./../controllers/views');

module.exports = function(app) {

  app.post('/token', oauth2Controller.token);
  app.post('/', oauth2Controller.loginUsername);
  app.post('/login', oauth2Controller.loginUsername);

  app.get('/logout', function(req, res, next) {
    // weren't logged in in the first place
    //if(!req.user) res.redirect('/login');

    req.logout();
    res.redirect(config.app.server.hostname);
  });

  app.post('/forgot', function(req, res, next) {
    // collect email
    var email = req.body['email'];
    if(!email) return next('Email not supplied');

    async.waterfall([
      // find user with that email
      function(done) {
        User.findOne({ email: email }, function(err, user) {
          if(err) return done(err);
          if(!user) return done('User/Email pair not found');

          done(null, user);
        });
      },
      // check for preexisting reset token
      function(user, done) {
        ResetToken.findOne({ user: user._id }, function(err, resetToken) {
          if(err) return done(err);
          if(_.isEmpty(resetToken)) return done(null, user);
          else return done('Password change already requested');
        });
      },
      // create token string
      function(user, done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token, user);
        });
      },
      // create a new reset token
      function(token, user, done) {
        ResetToken.create({
          user: user._id,
          token: token
        }, function(err, resetToken) {
          done(err, resetToken, user);
        });
      },
      // send the reset password email
      function(resetToken, user, done) {
        emailController.sendEmail(user.email, 'reset-pass', {
          user_email: user.email,
          reset_link: config.app.server.hostname + '/reset/' + resetToken.token
        }, function(err, results) {
          if(err) return done(err);
          else return done(null, results);
        });
      }
    ], function(err, results) {
      if(err) return next(err);
      else return res.json(results);
    });
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
  app.get('/invite/:token', checkInvite, viewController.renderApp);

  app.post('/forgot/group', function(req, res, next) {
    var email = req.body['email'];
    if(email == undefined || _.isEmpty(email)) return next('Email undefined');
    User.findOne({ email: email }, function(err, user) {
      if(err) return next(err);
      if(!user) return next('Email not found');
      Bevy.findOne({ _id: user.bevy }, function(err, bevy) {
        if(err) return next(err);
        if(!bevy) return next("User's bevy not found");
        emailController.sendEmail(user.email, 'find-group', {
          user_email: user.email,
          bevy_name: bevy.name,
          bevy_slug: bevy.slug,
          bevy_image: bevy.image,
          domain: config.app.server.domain
        }, function(err, results) {
          if(err) return next(err);
          return res.json(results);
        });
      });
    });
  });
};

function checkToken(req, res, next) {
  var token = req.params.token;
  ResetToken.findOne({ token: token }, function(err, resetToken) {
    if(err) return next(err);
    if(!resetToken) {
      return viewController.renderNotFound(req, res, next);
    }
    req.resetTokenUser = resetToken.user;
    return next();
  });
};

function checkInvite(req, res, next) {
  var token = req.params.token;
  InviteToken.findOne({ token: token }, function(err, inviteToken) {
    if(err) return next(err);
    if(!inviteToken) {
      return viewController.renderNotFound(req, res, next);
    }

    // load the invite token into the request object so it
    // can be passed down to the jade view
    req.inviteToken = inviteToken;

    // see if we're in the right subdomain
    if(req.subdomains.length <= 0 || req.subdomains[0] != inviteToken.bevy.slug) {
      // if we're not in any subdomain, or if we're at
      // the wrong subdomain,
      // redirect so we're at the right one
      var $path = req.path;
      return res.redirect('http://' + inviteToken.bevy.slug + '.' + config.app.server.domain + $path);
    }
    // everything's ok, continue
    return next();
  })
  .populate('bevy');
};
