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
	router.post('/comments/', api.comments.create);

	// SHOW
	router.get('/posts/:postid/comments/:id', api.comments.show);
	router.get('/comments/:id', api.comments.show);

	// EDIT
	router.get('/comments/:id/edit', api.comments.update);

	// UPDATE
	router.put('/posts/:postid/comments/:id', api.comments.update);
	router.patch('/posts/:postid/comments/:id', api.comments.update);

	router.put('/comments/:id', api.comments.update);
	router.patch('/comments/:id', api.comments.update);

	// DESTROY
	router.delete('/comments/:id', api.comments.destroy);
}
