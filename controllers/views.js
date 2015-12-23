/**
 * views.js
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');

exports.renderApp = function(req, res, next) {
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
};
