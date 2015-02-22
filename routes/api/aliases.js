'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/aliases', api.aliases.index);

	// CREATE
	router.get('/aliases/create', api.aliases.create);

	// STORE
	router.post('/aliases', api.aliases.create);

	// SHOW
	router.get('/aliases/:id', api.aliases.show);

	// EDIT
	router.get('/aliases/:id/edit', api.aliases.update);

	// UPDATE
	router.put('/aliases/:id', api.aliases.update);
	// browser hack
	// TODO: disable on production
	router.get('/aliases/:id/update', api.aliases.update);

	// DESTROY
	router.delete('/aliases/:id', api.aliases.destroy);
	// browser hack
	// TODO: disable on production
	router.get('/aliases/:id/destroy', api.aliases.destroy);
}
