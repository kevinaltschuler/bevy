'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/users/:id/aliases', api.aliases.index);

	// CREATE
	router.get('/users/:id/aliases/create', api.aliases.create);

	// STORE
	router.post('/users/:id/aliases', api.aliases.create);

	// SHOW
	router.get('/users/:id/aliases/:name', api.aliases.show);

	// EDIT
	router.get('/users/:id/aliases/:name/edit', api.aliases.edit);

	// UPDATE
	router.put('/users/:id/aliases/:name', api.aliases.update);
	// browser hack
	// TODO: disable on production
	router.get('/users/:id/aliases/:name/update', api.aliases.update);

	// DESTROY
	router.delete('/users/:id/aliases/:name', api.aliases.destroy);
	// browser hack
	// TODO: disable on production
	router.get('/users/:id/aliases/:name/destroy', api.aliases.destroy);
}
