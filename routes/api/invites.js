/**
 * routes/api/invites.js
 *
 * @author albert
 * @flow
 */

'use strict';

var inviteController = require('./../../controllers/invites');

module.exports = function(router) {
  router.get('/invites/:inviteid', inviteController.getInvite);
};
