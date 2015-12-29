/**
 * AppActions.js
 *
 * @author albert
 */

'use strict';

// imports
var dispatch = require('./../shared/helpers/dispatch');

var APP = require('./../constants').APP;

var AppActions = {

  load() {
    dispatch(APP.LOAD, {
    });
  },

  loadUser() {
    dispatch(APP.LOAD_USER, {
    });
  }

};
module.exports = AppActions;
