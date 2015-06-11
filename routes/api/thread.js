'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/users/:id/threads', api.threads.index);

	// CREATE
	router.post('/users/:id/threads/', api.threads.create);

	// UPDATE
	router.put('/users/:id/threads/:threadid', api.threads.update);
	router.patch('/users/:id/threads/:threadid', api.threads.update);

	// DESTROY
	router.delete('/users/:id/threads/:threadid', api.threads.destroy);

}
