/**
 * posts.js
 * @author albert
 * @flow
 */

'use strict';

var postController = require('./../../controllers/posts');
var oauth2Controller = require('./../../controllers/oauth2');
var permissionsController = require('./../../controllers/permissions');

module.exports = function(router) {
  router.get('/posts/search', [
      oauth2Controller.bearer
    ],
    postController.searchPosts
  );
  router.get('/posts/search/:query', [
      oauth2Controller.bearer
    ],
    postController.searchPosts
  );

  router.get('/boards/:boardid/posts', [
      oauth2Controller.bearer,
      //permissionsController.hasPrivateBoardAccess,
      //permissionsController.errorHandler
    ],
    postController.getBoardPosts
  );

  router.get('/bevies/:bevyid/posts', [
      oauth2Controller.bearer,
      permissionsController.hasPrivateBevyAccess,
      permissionsController.errorHandler
    ],
    postController.getBevyPosts
  );

  router.get('/users/:userid/posts', [
      oauth2Controller.bearer,
      //permissionsController.isSameUser,
      permissionsController.errorHandler
    ],
    postController.getUserPosts
  );

  router.post('/posts', [
      oauth2Controller.bearer,
      //permissionsController.hasPrivateBoardAccess,
      permissionsController.errorHandler
    ],
    postController.createPost
  );

  router.get('/posts/:postid', [
      oauth2Controller.bearer,
      //permissionsController.canViewPost,
      permissionsController.errorHandler
    ],
    postController.getPost
  );

  router.put('/posts/:postid', [
      oauth2Controller.bearer,
      //permissionsController.canModifyPost,
      permissionsController.errorHandler
    ],
    postController.updatePost
  );
  router.patch('/posts/:postid', [
      oauth2Controller.bearer,
      //permissionsController.canModifyPost,
      permissionsController.errorHandler
    ],
    postController.updatePost
  );

  router.delete('/posts/:postid', [
      oauth2Controller.bearer,
      //permissionsController.canModifyPost,
      permissionsController.errorHandler
    ],
    postController.destroyPost
  );
}
