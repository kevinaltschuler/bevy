/**
 * messages.js
 * @author albert
 * @flow
 */

'use strict';

var messageController = require('./../../controllers/messages');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
	router.get('/threads/:threadid/messages', [
			oauth2Controller.bearer,
			permissionsController.isThreadMember,
			permissionsController.errorHandler
		],
		messageController.getMessages
	);

	router.post('/messages', [
			oauth2Controller.bearer,
			permissionsController.isThreadMember,
			permissionsController.errorHandler
		],
		messageController.createMessage
	);

	router.get('/messages/:messageid', [
			oauth2Controller.bearer,
		],
		messageController.getMessage
	);

	router.put('/messages/:messageid', [
			oauth2Controller.bearer,
		],
		messageController.updateMessage
	);
	router.patch('/threads/:threadid/messages/:id', messageController.updateMessage);
	router.delete('/threads/:threadid/messages/:id', messageController.destroyMessage);
}
