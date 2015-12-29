/**
 * threads.js
 * @author albert
 * @flow
 */

'use strict';

var threadController = require('./../../controllers/threads');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
  router.get('/users/:userid/threads', [
      oauth2Controller.bearer,
      permissionsController.isSameUser,
      permissionsController.errorHandler
    ],
    threadController.getUserThreads
  );

  router.get('/bevies/:boardid/thread', [
      oauth2Controller.bearer,
      permissionsController.hasPrivateBoardAccess,
      permissionsController.errorHandler
    ],
    threadController.getBoardThreads
  );

  router.get('/threads/:threadid', [
      oauth2Controller.bearer,
      permissionsController.isThreadMember,
      permissionsController.errorHandler
    ],
    threadController.getThread
  );

  router.post('/threads', [
      oauth2Controller.bearer,
    ],
    threadController.createThread
  );

  router.put('/threads/:threadid', [
      oauth2Controller.bearer,
      permissionsController.isThreadMember,
      permissionsController.errorHandler
    ],
    threadController.updateThread
  );
  router.patch('/threads/:threadid', [
      oauth2Controller.bearer,
      permissionsController.isThreadMember,
      permissionsController.errorHandler
    ],
    threadController.updateThread
  );

  router.delete('/threads/:threadid', [
      oauth2Controller.bearer,
      permissionsController.isThreadMember,
      permissionsController.errorHandler
    ],
    threadController.destroyThread
  );
};
