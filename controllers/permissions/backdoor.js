/**
 * backdoor.js
 * @author albert
 * @flow
 */

'use strict';

var config = require('./../../config');

// build in a backdoor for easy testing via postman or the browser
var checkBackdoor = function(req) {
  if(req.query[config.auth.backdoor.key] == config.auth.backdoor.value
    || req.body[config.auth.backdoor.key] == config.auth.backdoor.value) {
    return true;
  } else return false;
};
module.exports = checkBackdoor;
