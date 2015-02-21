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
	router.get('/aliases/:name', api.aliases.show);

	// EDIT
	router.get('/aliases/:name/edit', api.aliases.edit);

	// UPDATE
	router.put('/aliases/:name', api.aliases.update);
	// browser hack
	// TODO: disable on production
	router.get('/aliases/:name/update', api.aliases.update);

	// DESTROY
	router.delete('/aliases/:name', api.aliases.destroy);
	// browser hack
	// TODO: disable on production
	router.get('/aliases/:name/destroy', api.aliases.destroy);
}
