'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');
var constants = require('./../constants');
var USER = constants.USER;

var UserActions = {
  update(image) {
    dispatch(USER.UPDATE, {
      image: (image == undefined) ? null : image
    });
  },
  search(query) {
    dispatch(USER.SEARCH, {
      query: (query == undefined) ? null : query
    });
  },

  linkAccount(account) {
    dispatch(USER.LINK_ACCOUNT, {
      account: account
    });
  },

  unlinkAccount(account) {
    dispatch(USER.UNLINK_ACCOUNT, {
      account: account
    });
  },

  switchUser(account_id) {
    dispatch(USER.SWITCH_USER, {
      account_id: account_id
    });
  }
}

module.exports = UserActions;
