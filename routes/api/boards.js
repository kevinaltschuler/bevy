/**
 * boards.js
 * @author albert
 * @flow
 */

'use strict';

var boardController = require('./../../controllers/boards');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
  router.get('/users/:userid/boards', [
      oauth2Controller.bearer,
      permissionsController.isSameUser,
      permissionsController.errorHandler
    ],
    boardController.getUserBoards
  );

  router.get('/bevies/:bevyid/boards', [
      oauth2Controller.bearer,
      permissionsController.hasPrivateBevyAccess,
      permissionsController.errorHandler
    ],
    boardController.getBevyBoards
  );

  router.post('/boards', [
      oauth2Controller.bearer,
      permissionsController.errorHandler
    ],
    boardController.createBoard
  );

  router.get('/boards/:boardid', [
      oauth2Controller.bearer,
      //permissionsController.hasPrivateBoardAccess,
      permissionsController.errorHandler
    ],
    boardController.getBoard
  );

  router.put('/boards/:boardid', [
      oauth2Controller.bearer,
      permissionsController.isBoardAdmin,
      permissionsController.errorHandler
    ],
    boardController.updateBoard
  );
  router.patch('/boards/:boardid', [
      oauth2Controller.bearer,
      permissionsController.isBoardAdmin,
      permissionsController.errorHandler
    ],
    boardController.updateBoard
  );

  router.delete('/boards/:boardid', [
      oauth2Controller.bearer,
      permissionsController.isBoardAdmin,
      permissionsController.errorHandler
    ],
    boardController.destroyBoard
  );

  router.get('/boards/:boardid/subscribers', [
      oauth2Controller.bearer
    ],
    boardController.getSubscribers
  );
};
