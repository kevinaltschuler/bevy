/**
 * middleware/cors.js
 *
 * lets us do stuff across domains
 *
 * @author albert
 * @flow
 */

'use strict';

module.exports = function(req, res, next) {
	// TODO: restrict cors domains
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'HEAD, GET, PUT, PATCH, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Requested-By, \
		 X-Access-Token, X-Revision, Content-Type, Accept, X-PINGOTHER, X-File-Name, \
		 Cache-Control, Key, Authorization, Content-Encoding, X-HTTP-Method-Override');

	next();
};
