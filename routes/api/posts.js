/**
 * posts.js
 * post API routes
 * @author albert
 * @flow
 */

'use strict';

var postController = require('./../../controllers/posts');

module.exports = function(router) {
	router.get('/bevies/:bevyid/posts', postController.getBevyPosts);
	router.post('/bevies/:bevyid/posts', postController.createPost);
	router.get('/bevies/:bevyid/posts/:id', postController.getPost);
	router.put('/bevies/:bevyid/posts/:id', postController.updatePost);
	router.patch('/bevies/:bevyid/posts/:id', postController.updatePost);
	router.delete('/bevies/:bevyid/posts/:id', postController.destroyPost);
	router.get('/users/:userid/posts/search/:query', postController.searchPosts);
	router.get('/users/:userid/posts', postController.getUserPosts);
}
