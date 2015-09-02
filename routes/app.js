'use strict';

var passport = require('passport');
var mailgun = require('./../config').mailgun();
var template = require('./../public/html/email/template.jsx')('nuts', 'kevin');
var async = require('async');
var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(app) {

  var emailHTML = template;

  //test email
  app.get('/emailtest', function(req, res, next) {
    mailgun.messages().send({
      from: 'Bevy Team <contact@joinbevy.com>',
      to: 'kevin@joinbevy.com',
      subject: 'Test Subject',
      html: emailHTML
    }, function(error, body) {
      res.json(body);
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

  var User = mongoose.model('User');
  var Bevy = mongoose.model('Bevy');
  var Notification = mongoose.model('Notification');
  var Post = mongoose.model('Post');
  var Comment = mongoose.model('Comment');
  var Thread = mongoose.model('ChatThread');
  var Message = mongoose.model('ChatMessage');

  // for everything else - pass it off to the react router
  // on the front end
  // this should be the last route ever checked
  app.get('/**', function(req, res, next) {

    if(_.isEmpty(req.user)) {
      res.render('app', {
        env: process.env.NODE_ENV,
        hostname: req.hostname,
        user: {}
      });
    } else {
      var user = req.user;

      return res.render('app', {
        env: process.env.NODE_ENV,
        hostname: req.hostname,
        user: user
      });
    }
  });
}
