/**
 * UserActions.js
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');
var constants = require('./../constants');
var USER = constants.USER;

var UserActions = {
  update(image) {
    Dispatcher.dispatch({
      actionType: USER.UPDATE,
      image: (image == undefined) ? null : image
    });
  },
  search(query) {
    Dispatcher.dispatch({
      actionType: USER.SEARCH,
      query: query
    });
  },
  login(username, password) {
    Dispatcher.dispatch({
      actionType: USER.LOGIN,
      username: username,
      password: password
    });
  },
  register(username, password, email) {
    Dispatcher.dispatch({
      actionType: USER.REGISTER,
      username: username,
      password: password,
      email: (email == undefined) ? '' : email
    });
  },
  refreshToken(refreshToken) {
    Dispatcher.dispatch({
      actionType: USER.REFRESH_TOKEN,
      refreshToken: refreshToken
    });
  },
}

module.exports = UserActions;
