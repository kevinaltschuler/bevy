/**
 * BevyActions.js
 * Action dispatcher for bevies
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var BEVY = require('./../constants').BEVY;
var constants = require('./../constants');

var BevyActions = {

  loadMyBevies() {
    Dispatcher.dispatch({
      actionType: BEVY.LOADMYBEVIES,
    });
  },

  loadBevyView(bevy_id) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.LOADBEVYVIEW,
      bevy_id: bevy_id
    });
  },

  create(name, image, slug) {
    if(_.isEmpty(name)) return;
    if(_.isEmpty(image)) {
      image = {
        filename: constants.siteurl + '/img/default_group_img.png',
        foreign: true
      };
    }
    if(_.isEmpty(slug)) return;

    Dispatcher.dispatch({
      actionType: BEVY.CREATE,
      name: name,
      image: image,
      slug: slug
    });
  },

  destroy(bevy_id) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.DESTROY,
      bevy_id: bevy_id
    });
  },

  update(bevy_id, name, description, image, settings) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.UPDATE,
      bevy_id: bevy_id,
      name: (name == undefined) ? null : name,
      description: (description == undefined) ? null : description,
      image: (image == undefined) ? null : image,
      settings: (settings == undefined) ? null : settings
    });
  },

  leave(bevy_id) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.LEAVE,
      bevy_id: bevy_id
    });
  },


  join(bevy_id) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.JOIN,
      bevy_id: bevy_id
    });
  },

  addUser(bevy_id, user_id, email) {
    if(_.isEmpty(bevy_id)) return;
    if(_.isEmpty(user_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.ADD_USER,
      bevy_id: bevy_id,
      user_id: user_id,
      email: (email == undefined) ? '' : email
    });
  },

  requestJoin(bevy, user) {
    if(_.isEmpty(bevy)) return;
    if(_.isEmpty(user)) return;
    Dispatcher.dispatch({
      actionType: BEVY.REQUEST_JOIN,
      bevy: bevy,
      user: user
    });
  },

  switchBevy(bevy_id) {
    Dispatcher.dispatch({
      actionType: BEVY.SWITCH,
      bevy_id: bevy_id || -1
    });
  },

  filterBevies(filter) {
    Dispatcher.dispatch({
      actionType: BEVY.SORT,
      filter: (filter == undefined) ? null : filter
    });
  },

  search(query) {
    Dispatcher.dispatch({
      actionType: BEVY.SEARCH,
      query: (query == undefined) ? null : query
    });
  }
};

module.exports = BevyActions;
