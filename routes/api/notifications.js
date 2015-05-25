/**
 * notifications.js
 *
 * notification API routes
 *
 * @author albert
 */

'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {
	// CREATE
	router.get('/notifications/create', api.notifications.create);
	router.post('/notifications', api.notifications.create);

	// INDEX
	router.get('/users/:userid/notifications', api.notifications.index);

	// LONG POLL
	router.get('/users/:userid/notifications/poll', api.notifications.poll);

	// SHOW
	//router.get('/users/:userid/notifications/:id', api.notifications.show);

	// DESTROY
	router.get('/users/:userid/notifications/:id/destroy', api.notifications.destroy);
	router.delete('/users/:userid/notifications/:id', api.notifications.destroy);


}
