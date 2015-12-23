/**
 * files.js
 * @author albert
 * @flow
 */

'use strict';

var fileController = require('./../../controllers/files');

module.exports = function(router) {
	router.post('/files', fileController.createFile);
	router.get('/files/:fileid', fileController.getFile);
	router.delete('/files/:filename', fileController.removeFile);
}
