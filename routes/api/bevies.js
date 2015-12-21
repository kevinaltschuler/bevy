/**
 * bevies.js
 * @author albert
 * @flow
 */

'use strict';

// load api functions
var bevyController = require('./../../controllers/bevies');

module.exports = function(router) {
  router.get('/users/:userid/bevies', bevyController.getBevies);
  router.get('/bevies', bevyController.getPublicBevies);
  router.post('/users/:userid/bevies', bevyController.createBevy);
  router.get('/users/:userid/bevies/:id', bevyController.getBevy);
  router.get('/bevies/:id', bevyController.getBevy);
  router.get('/bevies/search/:query', bevyController.searchBevies);
  router.put('/users/:userid/bevies/:id', bevyController.updateBevy);
  router.patch('/users/:userid/bevies/:id', bevyController.updateBevy);
  router.delete('/users/:userid/bevies/:id', bevyController.destroyBevy);
  router.get('/bevies/:slug/verify', bevyController.verifySlug);
};
