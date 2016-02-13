/**
 * BevyActions.js
 *
 * Action dispatcher for bevies
 *
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var Dispatcher = require('./../shared/dispatcher');
var BEVY = require('./../constants').BEVY;
var INVITE = require('./../constants').INVITE;
var constants = require('./../constants');

var BevyActions = {
  loadBevyView(bevy_id) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.LOADBEVYVIEW,
      bevy_id: bevy_id
    });
  },

  create(bevyName, bevyImage, bevySlug, adminEmail, adminName, inviteEmails) {
    if(_.isEmpty(bevyName)) return;
    if(_.isEmpty(bevyImage)) {
      bevyImage = {
        filename: constants.siteurl + '/img/default_group_img.png',
        foreign: true
      };
    }
    if(_.isEmpty(bevySlug)) return;
    if(_.isEmpty(adminEmail)) return;
    if(_.isEmpty(adminName)) return;
    if(_.isEmpty(inviteEmails)) 
      inviteEmails = [''];

    Dispatcher.dispatch({
      actionType: BEVY.CREATE,
      bevyName: bevyName,
      bevyImage: bevyImage,
      bevySlug: bevySlug,
      adminEmail: adminEmail,
      adminName: adminName,
      inviteEmails: inviteEmails
    });
  },

  destroy(bevy) {
    if(_.isEmpty(bevy)) return;

    Dispatcher.dispatch({
      actionType: BEVY.DESTROY,
      bevy: bevy
    });
  },

  update(bevy_id, name, image, slug, settings) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.UPDATE,
      bevy_id: bevy_id,
      name: (name == undefined) ? null : name,
      image: (image == undefined) ? null : image,
      slug: (slug == undefined) ? null : slug,
      settings: (settings == undefined) ? null : settings
    });
  },

  leave(bevy) {
    if(_.isEmpty(bevy)) return;
    Dispatcher.dispatch({
      actionType: BEVY.LEAVE,
      bevy: bevy
    });
  },

  join(bevy) {
    if(_.isEmpty(bevy)) return;
    Dispatcher.dispatch({
      actionType: BEVY.JOIN,
      bevy: bevy
    });
  },

  requestJoin(bevy_id, user) {
    if(_.isEmpty(bevy_id)) return;
    if(_.isEmpty(user)) return;
    Dispatcher.dispatch({
      actionType: BEVY.REQUEST_JOIN,
      bevy_id: bevy_id,
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
  },

  inviteUser(user) {
    Dispatcher.dispatch({
      actionType: INVITE.INVITE_USER,
      user: (user == undefined) ? null : user
    });
  },

  destroyInvite(invite_id) {
    Dispatcher.dispatch({
      actionType: INVITE.DESTROY,
      invite_id: (invite_id == undefined) ? null : invite_id
    });
  },

  acceptRequest(invite_id) {
    Dispatcher.dispatch({
      actionType: INVITE.ACCEPT_REQUEST,
      invite_id: (invite_id == undefined) ? null : invite_id
    });
  },
};

module.exports = BevyActions;
