/**
 * basic application config
 * manages environment flags and server settings
 */

'use strict';

var fs = require('fs');

// Set the current environment to true in the env object
var current_env = process.env.NODE_ENV || 'development';

var keys_dir = './';

exports.name = "bevy";

exports.env = {
	production: false,
	staging: false,
	test: false,
	development: false
};

exports.env[current_env] = true;

exports.log = {
	path: __dirname + "../log/app_#{currentEnv}.log"
};

if(current_env == 'development') {
	exports.server = {
		port: 80,
		// In staging and production, listen loopback. nginx listens on the network.
		ip: '127.0.0.1',
		hostname: 'http://bevy.dev'
	};
} else {
	exports.server = {
		port: 80,
		// In staging and production, listen loopback. nginx listens on the network.
		ip: '127.0.0.1',
		hostname: 'http://bvy.io'
	};
}

/*exports.ssl_opts = {
	  key: fs.readFileSync(keys_dir + 'server.key')
	, cert: fs.readFileSync(keys_dir + 'server.crt')
	, requestCert: true
	, rejectUnauthorized: false
	, agent: false
};*/

/*if (current_env != 'production' && current_env != 'staging') {
	exports.enableTests = true;
	// Listen on all IPs in dev/test (for testing from other machines)
	exports.server.ip = '0.0.0.0';
	exports.server.hostname = 'http://bevy.dev';
};*/
