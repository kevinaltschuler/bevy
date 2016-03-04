/**
 * views.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var config = require('./../config');

exports.renderApp = function(req, res, next) {
  var user = _.isEmpty(req.user) ? {} : req.user;
  var inviteToken = _.isEmpty(req.inviteToken) ? {} : req.inviteToken;
  return res.render('app', {
    env: process.env.NODE_ENV,
    hostname: req.hostname,
    user: user,
    inviteToken: inviteToken
  });
};

exports.renderNotFound = function(req, res, next) {

  return res.status(404).render('notfound', {
    env: process.env.NODE_ENV,
    hostname: req.hostname,
    domain: config.app.server.domain
  });
};
