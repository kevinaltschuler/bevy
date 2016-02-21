/**
 * AppActions.js
 *
 * @author albert
 * @flow
 */

'use strict';

var Dispatcher = require('./../shared/dispatcher');

var APP = require('./../constants').APP;

var AppActions = {
  load() {
    Dispatcher.dispatch({
      actionType: APP.LOAD,
    });
  },

  loadUser() {
    Dispatcher.dispatch({
      actionType: APP.LOAD_USER,
    });
  },

  openSidebar(page, opts) {
    Dispatcher.dispatch({
      actionType: APP.OPEN_SIDEBAR,
      page: page,
      opts: (opts == undefined) ? {} : opts
    });
  }
};

module.exports = AppActions;
