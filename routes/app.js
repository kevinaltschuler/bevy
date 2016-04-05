/**
 * routes/app.js
 * @author albert
 * @flow
 */

'use strict';

var fs = require('fs');
var path = require('path');
var passport = require('passport');
var config = require('./../config');
var mailgun = config.mailgun();
var async = require('async');
var mongoose = require('mongoose');
var _ = require('underscore');

var Bevy = require('./../models/Bevy');

var viewController = require('./../controllers/views');
var emailController = require('./../controllers/email');



module.exports = function(app) {

  app.get('/privacy', function(req, res, next) {
    var privacyPolicy = fs.readFileSync(
      path.resolve(__dirname, '..', 'public', 'html', 'privacypolicy.html'), 'utf-8'
    );
    res.set('Content-Type', 'text/html');
    res.send(privacyPolicy);
  });

  app.get('/tos', function(req, res, next) {
    var TOS = fs.readFileSync(
      path.resolve(__dirname, '..', 'public', 'html', 'TOS.html'), 'utf-8'
    );
    res.set('Content-Type', 'text/html');
    res.send(TOS);
  });

  app.get('/usertest', function(req, res, next) {
    res.json(req.user);
  });


  //test email
  //var emailHTML = template;

  app.get('/emailtest', function(req, res, next) {

    emailController.sendEmail('blahoink@gmail.com', 'reset-pass-confirmation', {
      user_email: 'blahoink@gmail.com',
      user_username: 'blahoink'
    }, function(err, results) {
      if(err) return next(err);
      return res.json(results);
    });

    /*emailController.sendEmail('blahoink@gmail.com', 'welcome', {
      user_email: 'blahoink@gmail.com',
      bevy_name: 'some new bevy',
      pass_link: 'http://joinbevy.com/reset/23094hoiu23h4982304'
    }, function(err, results) {
      if(err) return next(err);
      return res.json(results);
    });*/
  });

  app.post('/feedback', function(req, res, next) {
    var name = req.body['name'] || 'Anonymous';
    var body = req.body['body'] || '';

    mailgun.messages().send({
      from: name + ' <contact@joinbevy.com>',
      to: 'contact@joinbevy.com',
      subject: 'Feedback',
      text: body
    }, function(error, body) {
      res.json(body);
    });
  });

  app.post('/report', function(req, res, next) {
    var comment = req.body['comment_id'] || 'none';
    var post = req.body['post_id'] || 'none';

    mailgun.messages().send({
      from: 'contact@joinbevy.com',
      to: 'contact@joinbevy.com',
      subject: 'Reported Content',
      text: 'post: ' + post + ', comment: ' + comment 
    }, function(error, body) {
      res.json(body);
    });
  });

  // for everything else - pass it off to the react router
  // on the front end
  // this should be the last route ever checked
  app.get('/**', function(req, res, next) {
    var user = req.user;
    var subdomains = req.subdomains;
    if(subdomains.length == 1) {
      /*Bevy.findOne({ slug: subdomains[0] }, function(err, bevy) {
        if(err) return next(err);
        if(_.isEmpty(bevy)) return res.redirect(config.app.server.hostname + '/404');
        else return next();
      });*/
      // if the user is logged in
      if(!_.isEmpty(user)) {
        // see if they're in the right bevy
        if(user.bevy.slug != subdomains[0]) {
          // if not, direct them to the unauthorized page
          // which provides a link to their actual bevy

          // first check if the bevy exists
          Bevy.findOne({ slug: subdomains[0] }, function(err, bevy) {
            if(err) return next(err);
            // if the bevy doesn't exist, redirect to the bevy not found page
            if(_.isEmpty(bevy)) return viewController.renderNotFound(req, res, next);

            // if we're already viewing the unauthorized page, then return to
            // prevent a redirect loop
            if(req.path == '/unauthorized') return next();
            // otherwise send the redirect
            return res.redirect('/unauthorized');

          });
        } else {
          // else, they're in the right bevy. continue like normal
          return next();
        }
      } else {
        // user is not logged in. check if the bevy exists
        Bevy.findOne({ slug: subdomains[0] }, function(err, bevy) {
          if(err) return next(err);
          // if the bevy doesn't exist, redirect to the bevy not found page
          if(_.isEmpty(bevy)) return viewController.renderNotFound(req, res, next);

          // we'll only allow a few routes to be available to users who
          // haven't joined the bevy yet.

          // collect the route path into an array for easy checking
          var path_chunks = req.path.toString().split('/');
          var allowed_paths = ['invite'];
          if(path_chunks.length <= 1 || path_chunks[1].length <= 0) {
            // they're in the root of the subdomain, which is the login page
            // let the user continue
            return next();
          } else if(_.contains(allowed_paths, path_chunks[1])) {
            // they're in an allowed path of the bevy subdomain.
            // let the user continue
            return next();
          } else {
            // if they're trying to access a board or something else,
            // then redirect the user to the bevy subdomain's sign in page
            return res.redirect('/');
          }
        });
      }
    } else if (subdomains.length > 1) {
      return res.redirect(config.app.server.hostname);
    } else {
      return next();
    }
  }, viewController.renderApp);
}
