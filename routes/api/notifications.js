/**
 * notifications.js
 * notification API routes
 * @author albert
 * @flow
 */

'use strict';

var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');
var noteController = require('./../../controllers/notifications');

module.exports = function(router) {
	router.post('/notifications', [
			oauth2Controller.bearer
		],
		noteController.createNotification
	);

	router.get('/users/:userid/notifications', [
			oauth2Controller.bearer,
			permissionsController.isSameUser,
			permissionsController.errorHandler
		],
		noteController.getUserNotifications
	);

	router.put('/notifications/:notificationid', [
			oauth2Controller.bearer,
			permissionsController.isUserNotification,
			permissionsController.errorHandler
		],
		noteController.updateNotification
	);
	router.patch('/notifications/:notificationid', [
			oauth2Controller.bearer,
			permissionsController.isUserNotification,
			permissionsController.errorHandler
		],
		noteController.updateNotification
	);

	router.delete('/notifications/:notificationid', [
			oauth2Controller.bearer,
			permissionsController.isUserNotification,
			permissionsController.errorHandler
		],
		noteController.destroyNotification
	);
}
