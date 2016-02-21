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

  /**
   * search for users within a bevy
   * @param query {string} - the search query
   * @param bevy_id {string} - the id of the bevy to search within
   * @param role {string} - role of the users to search for.
   * e.g., restrict search to admins only
   */
  search(query, bevy_id, role) {
    Dispatcher.dispatch({
      actionType: USER.SEARCH,
      query: query,
      bevy_id: bevy_id,
      role: (role == undefined) ? 'members' : role
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

  openSidebar(page, profileUser) {
    Dispatcher.dispatch({
      actionType: USER.OPEN_SIDEBAR,
      page: page,
      profileUser: (profileUser == undefined) ? {} : profileUser
    });
  },
}

module.exports = UserActions;
