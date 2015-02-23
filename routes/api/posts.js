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
	router.get('/posts', api.posts.index);

	// CREATE
	router.get('/posts/create', api.posts.create);
	router.post('/posts', api.posts.create);

	// SHOW
	router.get('/posts/:id', api.posts.show);

	// EDIT
	router.get('/posts/:id/edit', api.posts.update);

	// UPDATE
	router.get('/posts/:id/update', api.posts.update);
	router.put('/posts/:id', api.posts.update);

	// DESTROY
	router.get('/posts/:id/destroy', api.posts.destroy);
	router.delete('/posts/:id', api.posts.destroy);

}
