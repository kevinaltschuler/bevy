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

  update(bevy_id, name, image, settings) {
    if(_.isEmpty(bevy_id)) return;

    Dispatcher.dispatch({
      actionType: BEVY.UPDATE,
      bevy_id: bevy_id,
      name: (name == undefined) ? null : name,
      image: (image == undefined) ? null : image,
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
};

module.exports = BevyActions;
