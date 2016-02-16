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
	router.get('/users/:id', userController.getUser);

	router.put('/users/:id', userController.updateUser);
	router.patch('/users/:id', userController.updateUser);
	router.post('/users/:id/boards', userController.addBoard);
	//router.delete('/users/:id/boards/:id', userController.removeBoard);
	router.delete('/users/:id', userController.destroyUser);

	// VERIFY USERNAME
	router.post('/verify/username', userController.verifyUsername);
	// VERIFY EMAIL
	router.post('/verify/email', userController.verifyEmail);

	// DEVICES
	router.get('/users/:id/devices', userController.getDevices);
	router.post('/users/:id/devices', userController.addDevice);
	router.put('/users/:id/devices/:deviceid', userController.updateDevice);
	router.patch('/users/:id/devices/:deviceid', userController.updateDevice);
	router.delete('/users/:id/device/:deviceid', userController.removeDevice);
};
