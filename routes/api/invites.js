/**
 * routes/api/invites.js
 *
 * @author albert
 * @flow
 */

'use strict';

var inviteController = require('./../../controllers/invites');

module.exports = function(router) {
  router.post('/invites', inviteController.createInvite);
  router.get('/invites/:inviteid', inviteController.getInvite);
  router.post('/invites/:inviteid/accept', inviteController.acceptInvite);
};
