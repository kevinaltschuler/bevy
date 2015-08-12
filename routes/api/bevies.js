'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {
	// INDEX
	router.get('/users/:userid/bevies', api.bevies.index);
	router.get('/bevies', api.bevies.indexPublic);

	// CREATE
	router.post('/users/:userid/bevies', api.bevies.create);

	// SHOW
	router.get('/users/:userid/bevies/:id', api.bevies.show);
	router.get('/bevies/:id', api.bevies.show);

	// SEARCH
	router.get('/bevies/search/:query', api.bevies.search);

	// UPDATE
	router.put('/users/:userid/bevies/:id', api.bevies.update);
	router.patch('/users/:userid/bevies/:id', api.bevies.update);

	// DESTROY
	router.delete('/users/:userid/bevies/:id', api.bevies.destroy);
};
