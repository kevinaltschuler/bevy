/**
 * bevies.js
 * @author albert
 * @flow
 */

'use strict';

var bevyController = require('./../../controllers/bevies');

module.exports = function(router) {
  router.get('/users/:userid/bevies', bevyController.getUserBevies);
  router.get('/bevies', bevyController.getPublicBevies);
  router.post('/bevies', bevyController.createBevy);
  router.get('/bevies/:id', bevyController.getBevy);
  router.get('/bevies/search/:query', bevyController.searchBevies);
  router.patch('/bevies/:id/boards', bevyController.addBoard);
  router.put('/bevies/:id', bevyController.updateBevy);
  router.patch('/bevies/:id', bevyController.updateBevy);
  router.delete('/bevies/:id', bevyController.destroyBevy);
  router.get('/bevies/:slug/verify', bevyController.verifySlug);
};
