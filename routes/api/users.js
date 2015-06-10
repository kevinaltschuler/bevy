'use strict';

// TODO: AUTH

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/users', api.users.index);

	// CREATE
	router.get('/users/create', api.users.create);

	// STORE
	router.post('/users', api.users.create);

	// SHOW
	router.get('/users/:id', api.users.show);

	// EDIT
	router.get('/users/:id/edit', api.users.update);

	// UPDATE
	router.put('/users/:id', api.users.update);
	router.patch('/users/:id', api.users.update);
	router.get('/users/:id/update', api.users.update);

	// DESTROY
	router.delete('/users/:id', api.users.destroy);
	router.get('/users/:id/destroy', api.users.destroy);


	// CONTACTS
	router.get('/users/:id/contacts', api.users.getContacts);

};
