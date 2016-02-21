/**
 * users.js
 * @author albert
 * @flow
 */

'use strict';

var userController = require('./../../controllers/users');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
	router.get('/users/search', userController.searchUsers);
	router.get('/users/search/', userController.searchUsers);
	router.get('/users/search/:query', userController.searchUsers);

	router.get('/users', userController.getUsers);
	//router.post('/users', userController.createUser);
	router.get('/users/:userid', userController.getUser);

	router.put('/users/:id', userController.updateUser);
	router.patch('/users/:id', userController.updateUser);
	router.post('/users/:id/boards', userController.addBoard);
	//router.delete('/users/:id/boards/:id', userController.removeBoard);
	router.delete('/users/:id', userController.destroyUser);

	// VERIFY USERNAME
	router.post('/verify/username', userController.verifyUsername);
	// VERIFY EMAIL
	router.post('/verify/email', userController.verifyEmail);
};
