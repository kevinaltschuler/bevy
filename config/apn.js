/**
 * config/apn.js
 * @author albert
 * @flow
 */

'use strict';

var fs = require('fs');
var path = require('path');

var prodCert = fs.readFileSync(
  path.resolve(__dirname, '..', 'noteprod', 'cert.pem'),
  'utf-8'
);
var prodKey = fs.readFileSync(
  path.resolve(__dirname, '..', 'noteprod', 'key.pem'),
  'utf-8'
);
var devCert = fs.readFileSync(
  path.resolve(__dirname, '..', 'notedev', 'cert.pem'),
  'utf-8'
);
var devKey = fs.readFileSync(
  path.resolve(__dirname, '..', 'notedev', 'key.pem'),
  'utf-8'
);

module.exports = {
  ios: {
    prodCert: prodCert,
    prodKey: prodKey,
    devCert: devCert,
    devKey: devKey,
    production: true,
    // Expires 1 hour from now
    expires_in: (Math.floor(Date.now() / 1000) + 3600),
    badge: 0,
    sound: 'ping.aiff',

  },
  android: {
    collapse_key: 'com.bevyios',
    priority: 'high',
    // expire 1 day from now
    time_to_live: 1 * 60 * 60 * 24,
    icon: 'ic_launcher',
    content_available: true,
    delay_while_idle: false,
    click_action: 'android.intent.action.MAIN'
  }
};
