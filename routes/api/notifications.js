/**
 * notifications.js
 *
 * notification API routes
 *
 * @author albert
 */

'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	//router.get('/bevies/:bevyid/posts', api.posts.index);

	// CREATE
	//router.get('/bevies/:bevyid/posts/create', api.posts.create);
	//router.post('/bevies/:bevyid/posts', api.posts.create);

	// SHOW
	//router.get('/bevies/:bevyid/posts/:id', api.posts.show);

	// EDIT
	//router.get('/bevies/:bevyid/posts/:id/edit', api.posts.update);

	// UPDATE
	//router.get('/bevies/:bevyid/posts/:id/update', api.posts.update);
	//router.put('/bevies/:bevyid/posts/:id', api.posts.update);
	//router.patch('/bevies/:bevyid/posts/:id', api.posts.update);

	// DESTROY
	//router.get('/bevies/:bevyid/posts/:id/destroy', api.posts.destroy);
	//router.delete('/bevies/:bevyid/posts/:id', api.posts.destroy);

	// CREATE
	router.get('/notifications/create', api.notifications.create);
	router.post('/notifications', api.notifications.create);

	// INDEX
	router.get('/users/:userid/notifications', api.notifications.index);

	// SHOW
	router.get('/users/:userid/notifications/:id', api.notifications.show);

	// DESTROY
	router.get('/users/:userid/notifications/:id', api.notifications.destroy);
	router.delete('/users/:userid/notifications/:id', api.notifications.destroy);
}
