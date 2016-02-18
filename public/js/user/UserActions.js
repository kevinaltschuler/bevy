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
  /**
   * update user information
   *
   * @param firstName {string} - the first name of the user
   * @param lastName {string} - the last name of the user
   * @param title {string} - the title of the user
   * @param phoneNumber {string} - the phone number of the user
   * @param image {objeft} - the image object of the user
   */
  update(firstName, lastName, title, phoneNumber, image) {
    Dispatcher.dispatch({
      actionType: USER.UPDATE,
      firstName: firstName,
      lastName: lastName,
      title: title,
      phoneNumber: phoneNumber,
      image: image
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
