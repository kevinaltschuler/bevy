/**
 * routes/api/invites.js
 *
 * @author albert
 * @flow
 */

'use strict';

var authController = require('./../../controllers/permissions');
var inviteController = require('./../../controllers/invites');

module.exports = function(router) {
  router.post('/invites', inviteController.createInvite);
  router.get('/invites/:inviteid', inviteController.getInvite);
  router.get('/bevies/:bevyid/invites', inviteController.getBevyInvites);
  router.post('/invites/:inviteid/accept', inviteController.acceptInvite);
};
