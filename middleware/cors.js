'use strict';

module.exports = cors;

function cors() {
	return function(req, res, next) {
		// TODO: restrict cors domains
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-Access-Token, X-Revision, Content-Type');

		next();
	}
}
