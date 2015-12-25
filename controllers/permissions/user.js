/**
 * permissions/user.js
 * @author albert
 * @flow
 */

'use strict';

var User = require('./../../models/User');
var checkBackdoor = require('./backdoor');

// check if the token's user is the same as the user resource
// they're trying to access
exports.isSameUser = function(req, res, next) {
  if(checkBackdoor(req)) return next();
  var user = req.user;
  var user_id = req.params.userid;
  if(user._id == user_id) {
    // same user, go ahead
    return next();
  } else {
    // throw error
    return next('Token user does not match id of resource user');
  }
};
