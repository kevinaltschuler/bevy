/**
 * routes/app.js
 * @author albert
 * @flow
 */

'use strict';

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
      if(!_.isEmpty(user)) {
        if(user.bevy.slug != subdomains[0]) {
          return res.redirect(config.app.server.hostname);
        }
      }
      return next();

    } else if (subdomains.length > 1) {
      return res.redirect(config.app.server.hostname);
    } else {
      return next();
    }
  }, viewController.renderApp);
}
