/**
 * routes/app.js
 * @author albert
 * @flow
 */

'use strict';

var passport = require('passport');
var mailgun = require('./../config').mailgun();
var template = require('./../public/html/email/template.jsx')('nuts', 'kevin');
var async = require('async');
var mongoose = require('mongoose');
var _ = require('underscore');

var viewController = require('./../controllers/views');
var emailController = require('./../controllers/email');

module.exports = function(app) {
  app.get('/usertest', function(req, res, next) {
    res.json(req.user);
  });

  //test email
  //var emailHTML = template;

  app.get('/emailtest', function(req, res, next) {

    emailController.sendEmail('blahoink@gmail.com', 'welcome', {
      user_email: 'blahoink@gmail.com',
      bevy_name: 'some new bevy',
      pass_link: 'http://joinbevy.com/reset/23094hoiu23h4982304'
    }, function(err, results) {
      if(err) return next(err);
      return res.json(results);
    });
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
  app.get('/**', viewController.renderApp);
}
