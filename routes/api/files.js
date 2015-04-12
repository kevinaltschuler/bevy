/**
 * files.js
 *
 * @author albert
 */

'use strict';

var api = require('./../../api');

module.exports = function(router) {

	router.get('/files/upload', api.files.upload);
	router.post('/files/upload', api.files.upload);
	router.put('/files/upload', api.files.upload);
	router.post('/files', api.files.upload);

	router.get('/files/:fileid', api.files.retrieve);
}
