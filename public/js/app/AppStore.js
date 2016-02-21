/**
 * AppStore.js
 *
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var Dispatcher = require('./../shared/dispatcher');

var constants = require('./../constants');
var APP = constants.APP;

var AppStore = _.extend({}, Backbone.Events);
_.extend(AppStore, {
  handleDispatch(payload) {
    switch(payload.actionType) {
      case APP.OPEN_SIDEBAR:
        this.trigger(APP.OPEN_SIDEBAR, {
          page: payload.page,
          opts: payload.opts
        });
        break;
    }
  }
});

var dispatchToken = Dispatcher.register(AppStore.handleDispatch.bind(AppStore));
AppStore.dispatchToken = dispatchToken;

module.exports = AppStore;
