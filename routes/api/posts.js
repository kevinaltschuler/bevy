/**
 * posts.js
 *
 * post API routes
 *
 * @author albert
 */

'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/bevies/:bevyid/posts', api.posts.index);

	// CREATE
	router.post('/bevies/:bevyid/posts', api.posts.create);

	// SHOW
	router.get('/bevies/:bevyid/posts/:id', api.posts.show);

	// UPDATE
	router.put('/bevies/:bevyid/posts/:id', api.posts.update);
	router.patch('/bevies/:bevyid/posts/:id', api.posts.update);

	// DESTROY
	router.delete('/bevies/:bevyid/posts/:id', api.posts.destroy);

	// SEARCH
	router.get('/users/:userid/posts/search/:query', api.posts.search);

	// posts by that user
	router.get('/users/:userid/posts', api.posts.userPosts);

	// frontpage
	router.get('/users/:userid/frontpage', api.posts.frontpage);
}
