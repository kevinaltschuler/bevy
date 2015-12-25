/**
 * comments.js
 * @author albert
 * @flow
 */

'use strict';

var commentController = require('./../../controllers/comments');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
	router.get('/posts/:postid/comments', [
			oauth2Controller.bearer,
			permissionsController.canViewPost,
			permissionsController.errorHandler
		],
		commentController.getComments
	);

	router.post('/comments', [
			oauth2Controller.bearer,
			permissionsController.canCreateComment,
			permissionsController.errorHandler
		],
		commentController.createComment
	);

	router.get('/comments/:commentid', [
			oauth2Controller.bearer,
			permissionsController.canViewComment,
			permissionsController.errorHandler
		],
		commentController.getComment
	);

	router.put('/comments/:commentid', [
			oauth2Controller.bearer,
			permissionsController.canModifyComment,
			permissionsController.errorHandler
		],
		commentController.updateComment
	);
	router.patch('/comments/:commentid', [
			oauth2Controller.bearer,
			permissionsController.canModifyComment,
			permissionsController.errorHandler
		],
		commentController.updateComment
	);

	router.delete('/comments/:commentid', [
			oauth2Controller.bearer,
			permissionsController.canModifyComment,
			permissionsController.errorHandler
		],
		commentController.destroyComment
	);
}
