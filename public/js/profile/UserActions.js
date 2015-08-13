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
  },
  search(query) {
    dispatch(USER.SEARCH, {
      query: (query == undefined) ? null : query
    });
  }
}

module.exports = UserActions;
