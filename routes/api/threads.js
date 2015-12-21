/**
 * threads.js
 * @author albert
 * @flow
 */

'use strict';

var threadController = require('./../../controllers/threads');

module.exports = function(router) {
  router.get('/users/:id/threads', threadController.getThreads);
  router.get('/bevies/:id/thread', threadController.getThread);
  router.get('/threads/:id', threadController.getThread);
  router.post('/threads', threadController.createThread);
  router.put('/threads/:threadid', threadController.updateThread);
  router.patch('/threads/:threadid', threadController.updateThread);
  router.delete('/threads/:threadid', threadController.destroyThread);
}
