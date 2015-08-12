'use strict';

// TODO: AUTH

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// GET FROM GOOGLE ID (mobile)
	router.get('/users/google/:id', api.users.getGoogle);

	// INDEX
	router.get('/users', api.users.index);

	// CREATE
	router.post('/users', api.users.create);

	// SHOW
	router.get('/users/:id', api.users.show);

	// UPDATE
	router.put('/users/:id', api.users.update);
	router.patch('/users/:id', api.users.update);

	// DESTROY
	router.delete('/users/:id', api.users.destroy);

	// CONTACTS
	router.get('/users/:id/contacts', api.users.getContacts);

};
