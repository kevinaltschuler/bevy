/**
 * users.js
 * @author albert
 * @flow
 */

'use strict';

// load api functions
var userController = require('./../../controllers/users');

module.exports = function(router) {
	router.get('/users/google/:id', userController.getUserFromGoogle);
	router.get('/users', userController.getUsers);
	router.post('/users', userController.createUser);
	router.get('/users/:id', userController.getUser);
	router.get('/users/search', userController.searchUsers);
	router.get('/users/search/:query', userController.searchUsers);
	router.put('/users/:id', userController.updateUser);
	router.patch('/users/:id', userController.updateUser);
	router.patch('/users/:id/boards', userController.addBoard);
	router.delete('/users/:id', userController.destroyUser);

	// VERIFY USERNAME
	router.get('/users/:username/verify', userController.verifyUsername);

	// DEVICES
	router.get('/users/:id/devices', userController.getDevices);
	router.post('/users/:id/devices', userController.addDevice);
	router.put('/users/:id/devices/:deviceid', userController.updateDevice);
	router.patch('/users/:id/devices/:deviceid', userController.updateDevice);
	router.delete('/users/:id/device/:deviceid', userController.removeDevice);
};
