/**
 * messages.js
 * @author albert
 * @flow
 */

'use strict';

// load api functions
var messageController = require('./../../controllers/messages');

module.exports = function(router) {
	router.get('/threads/:threadid/messages', messageController.getMessages);
	router.post('/threads/:threadid/messages', messageController.createMessage);
	router.put('/threads/:threadid/messages/:id', messageController.updateMessage);
	router.patch('/threads/:threadid/messages/:id', messageController.updateMessage);
	router.delete('/threads/:threadid/messages/:id', messageController.destroyMessage);
}
