/**
 * posts.js
 * post API routes
 * @author albert
 * @flow
 */

'use strict';

var postController = require('./../../controllers/posts');

module.exports = function(router) {
  router.get('/boards/:id/posts', postController.getBoardPosts);
  router.get('/bevies/:id/posts', postController.getBevyPosts);
  router.get('/posts/search/:query', postController.searchPosts);
  router.get('/users/:id/posts', postController.getUserPosts);
  router.post('/posts', postController.createPost);
  router.get('/posts/:id', postController.getPost);
  router.put('/posts/:id', postController.updatePost);
  router.patch('/posts/:id', postController.updatePost);
  router.delete('/posts/:id', postController.destroyPost);
}
