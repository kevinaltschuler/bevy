/**
 * collection point for all config files
 */

'use strict';

var app = require('./app');
var database = require('./database');
var passport = require('./passport');
var mailgun = require('./mailgun');

exports.app = app;
exports.database = database;
exports.passport = passport;
exports.mailgun = mailgun;
