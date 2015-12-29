/**
 * routes/api/invites.js
 * @author albert
 * @flow
 */

var invitesController = require('./../../controllers/invites');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
  router.get('/bevies/:bevyid/invites', invitesController.getBevyInvites);
  router.get('/boards/:boardid/invites', invitesController.getBoardInvites);
  router.get('/users/:userid/invites', invitesController.getUserInvites);
  router.post('/invites', invitesController.createInvite);
  router.get('/invites/:inviteid/accept', invitesController.acceptInvite);
  router.get('/invites/:inviteid/reject', invitesController.rejectInvite);
  router.delete('/invites/:inviteid', invitesController.destroyInvite);
};
