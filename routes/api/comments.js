/**
 * comments.js
 *
 * @author albert
 */

'use strict';

var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/posts/:postid/comments', api.comments.index);

	// CREATE
	router.get('/posts/:postid/comments/create', api.comments.create);
	router.post('/posts/:postid/comments', api.comments.create);

	router.get('/comments/:id/create', api.comments.create);
	router.post('/comments/:id', api.comments.create);

	router.post('/comments/', api.comments.create);


	// SHOW
	router.get('/posts/:postid/comments/:id', api.comments.show);
	router.get('/comments/:id', api.comments.show);

	// EDIT
	router.get('/posts/:postid/comments/:id/edit', api.comments.update);
	router.get('/comments/:id/edit', api.comments.update);

	// UPDATE
	router.get('/posts/:postid/comments/:id/update', api.comments.update);
	router.put('/posts/:postid/comments/:id', api.comments.update);
	router.patch('/posts/:postid/comments/:id', api.comments.update);

	router.get('/comments/:id/update', api.comments.update);
	router.put('/comments/:id', api.comments.update);
	router.patch('/comments/:id', api.comments.update);

	// DESTROY
	router.get('/posts/:postid/comments/:id/destroy', api.comments.destroy);
	router.delete('/posts/:postid/comments/:id', api.comments.destroy);

	router.get('/comments/:id/destroy', api.comments.destroy);
	router.delete('/comments/:id', api.comments.destroy);
}
