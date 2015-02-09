'use strict';

// TODO: AUTH

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/user', api.users.index);

	// CREATE
	router.get('/user/create', api.users.create);

	// STORE
	//router.post('/user', function(req, res) {
	//	res.json({
	//		status: 'POST /user'
	//	});
	//});

	// SHOW
	router.get('/user/:id', api.users.show);

	// EDIT
	router.get('/user/:id/edit', api.users.edit);

	// UPDATE
	router.put('/user/:id', api.users.update);
	// browser hack
	// TODO: disable on production
	router.get('/user/:id/update', api.users.update);

	// DESTROY
	router.delete('/user/:id', api.users.destroy);
	// browser hack
	// TODO: disable on production
	router.get('/user/:id/destroy', api.users.destroy);

};
