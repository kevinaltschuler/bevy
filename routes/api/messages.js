'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/threads/:threadid/messages', api.messages.index);

	// CREATE
	router.post('/threads/:threadid/messages', api.messages.create);

	// UPDATE
	router.put('/threads/:threadid/messages/:id', api.messages.update);
	router.patch('/threads/:threadid/messages/:id', api.messages.update);

	// DESTROY
	router.delete('/threads/:threadid/messages/:id', api.messages.destroy);

}
