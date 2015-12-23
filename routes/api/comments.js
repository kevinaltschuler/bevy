/**
 * comments.js
 * @author albert
 * @flow
 */

'use strict';

var commentController = require('./../../controllers/comments');

module.exports = function(router) {
	router.get('/posts/:postid/comments', commentController.getComments);
	router.post('/comments/', commentController.createComment);
	router.get('/comments/:id', commentController.getComment);
	router.put('/comments/:id', commentController.updateComment);
	router.patch('/comments/:id', commentController.updateComment);
	router.delete('/comments/:id', commentController.destroyComment);
}
