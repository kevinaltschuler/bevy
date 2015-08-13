'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var USER = constants.USER;

var UserActions = {
  update(image_url) {
    dispatch(USER.UPDATE, {
      image_url: (image_url == undefined) ? null : image_url
    });
  }
}

module.exports = UserActions;
