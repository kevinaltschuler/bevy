/**
 * collection point for all config files
 */

'use strict';

var app = require('./app');
var database = require('./database');
var passport = require('./passport');

exports.app = app;
exports.database = database;
exports.passport = passport;
