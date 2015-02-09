'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/user', api.users.index);

	// CREATE
	router.get('/user/create', api.users.create);

	// STORE
	router.post('/user', function(req, res) {
		res.json({
			status: 'POST /user'
		});
	});

	// SHOW
	router.get('/user/:id', function(req, res) {
		res.json({
			status: 'GET /user/' + req.params.id
		});
	});

	// EDIT
	router.get('/user/:id/edit', function(req, res) {
		res.json({
			status: 'GET /user/' + req.params.id + '/edit'
		});
	});

	// UPDATE
	router.put('/user/:id', function(req, res) {
		res.json({
			status: 'PUT/PATCH /user/' + req.params.id
		});
	});

	// DESTROY
	router.delete('/user/:id', function(req, res) {
		res.json({
			status: 'DELETE /user/' + req.params.id
		});
	});
};
