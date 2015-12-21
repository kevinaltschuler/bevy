/**
 * boards.js
 * @author albert
 * @flow
 */

'use strict';

var boardController = require('./../../controllers/boards');

module.exports = function(router) {
  router.get('/users/:id/boards', boardController.getUserBoards);
  router.get('/bevies/:id/boards', boardController.getBevyBoards);
  router.post('/boards', boardController.createBoard);
  router.get('/boards/:id', boardController.getBoard);
  router.put('/boards/:id', boardController.updateBoard);
  router.patch('/boards/:id', boardController.updateBoard);
  router.delete('/boards/:id', boardController.destroyBoard);
};
