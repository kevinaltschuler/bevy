/**
 * bevies.js
 * @author albert
 * @flow
 */

'use strict';

var bevyController = require('./../../controllers/bevies');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
  router.get('/bevies', bevyController.getPublicBevies);

  router.post('/bevies', [
      //oauth2Controller.bearer
    ],
    bevyController.createBevy
  );

  router.get('/bevies/:bevyid', [
      //oauth2Controller.bearer
    ],
    bevyController.getBevy
  );

  router.get('/bevies/search/:query', [
      //oauth2Controller.bearer,
      //permissionsController.errorHandler
    ],
    bevyController.searchBevies
  );

  router.post('/bevies/:bevyid/boards', [
      //oauth2Controller.bearer,
      //permissionsController.isBevyMember,
      //permissionsController.errorHandler
    ],
    bevyController.addBoard
  );

  router.put('/bevies/:bevyid', [
      //oauth2Controller.bearer,
      //permissionsController.isBevyMember,
      //permissionsController.isBevyAdmin,
      //permissionsController.errorHandler
    ],
    bevyController.updateBevy
  );
  router.patch('/bevies/:bevyid', [
      //oauth2Controller.bearer,
      //permissionsController.isBevyAdmin,
      //permissionsController.errorHandler
    ],
    bevyController.updateBevy
  );

  router.delete('/bevies/:bevyid', [
      //oauth2Controller.bearer,
      //permissionsController.isBevyAdmin,
      //permissionsController.errorHandler
    ],
    bevyController.destroyBevy
  );

  router.get('/bevies/:slug/verify', bevyController.verifySlug);

  router.get('/bevies/:bevyid/subscribers', [
      //oauth2Controller.bearer
    ],
    bevyController.getSubscribers
  );
};
