/**
 * notifications.js
 * notification API routes
 * @author albert
 * @flow
 */

'use strict';

// load api functions
var noteController = require('./../../controllers/notifications');

module.exports = function(router) {
	router.post('/notifications', noteController.createNotification);
	router.get('/users/:userid/notifications', noteController.getNotifications);
	router.get('/users/:userid/notifications/poll', noteController.pollNotifications);
	//router.get('/users/:userid/offline', api.notifications.offline);
	router.put('/users/:userid/notifications/:id', noteController.updateNotification);
	router.patch('/users/:userid/notifications/:id', noteController.updateNotification);
	router.delete('/users/:userid/notifications/:id', noteController.destroyNotification);
}
