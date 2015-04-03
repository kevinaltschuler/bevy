'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/users/:userid/aliases', api.aliases.index);

	// CREATE
	router.get('/users/:userid/aliases/create', api.aliases.create);

	// STORE
	router.post('/users/:userid/aliases', api.aliases.create);

	// SHOW
	router.get('/users/:userid/aliases/:id', api.aliases.show);

	// EDIT
	router.get('/users/:userid/aliases/:id/edit', api.aliases.update);

	// UPDATE
	router.put('/users/:userid/aliases/:id', api.aliases.update);
	router.patch('/users/:userid/aliases/:id', api.aliases.update);
	// browser hack
	// TODO: disable on production
	router.get('/users/:userid/aliases/:id/update', api.aliases.update);

	// DESTROY
	router.delete('/users/:userid/aliases/:id', api.aliases.destroy);
	// browser hack
	// TODO: disable on production
	router.get('/users/:userid/aliases/:id/destroy', api.aliases.destroy);
}
