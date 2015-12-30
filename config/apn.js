/**
 * config/apn.js
 * @author albert
 * @flow
 */

'use strict';

module.exports = {
  ios: {
    cert: './../noteprod/cert.pem',
    key: './../noteprod/key.pem',
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
