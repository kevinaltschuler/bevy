'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/bevies', api.bevies.index);

	// CREATE
	router.get('/bevies/create', api.bevies.create);
	router.post('/bevies', api.bevies.create);

	// SHOW
	router.get('/bevies/:id', api.bevies.show);

	// EDIT
	router.get('/bevies/:id/edit', api.bevies.update);

	// UPDATE
	router.get('/bevies/:id/update', api.bevies.update);
	router.put('/bevies/:id', api.bevies.update);
	router.patch('/bevies/:id', api.bevies.update);

	// DESTROY
	router.get('/bevies/:id/destroy', api.bevies.destroy);
	router.delete('/bevies/:id', api.bevies.destroy);

};
