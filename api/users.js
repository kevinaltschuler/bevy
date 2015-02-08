'use strict';

module.exports = function(router) {

	// INDEX
	router.get('/user', function(req, res) {
		res.json({
			status: 'GET /user'
		});
	});

	// CREATE
	router.get('/user/create', function(req, res) {
		res.json({
			status: 'GET /user/create'
		});
	});

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
