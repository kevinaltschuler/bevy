'use strict';

var _ = require('underscore');

exports.log_errors = function(err, req, res, next) {
	console.error('log_errors', err.toString());
	next(err);
}
exports.client_error_handler = function(err, req, res, next) {
	console.error('client_errors', err.toString());
	if(!res.headersSent) {
		res.send(500, {
			error: err.toString()
		});
	}
	if(req.xhr) {
		console.error(err);
		if(!res.headersSent) {
			res.send(500, {
				error: err.toString()
			});
		}
	} else {
		next(err);
	}
}

exports.error_handler = function(err, req, res, next) {
	console.error('last_errors ', err.toString());
	if(!res.headersSent) {
		res.send(500, {
			error: err.toString()
		});
	}
}

exports.gen = function(message, req, type, code) {
	var obj = {};
	obj.object = 'error';
	if(!_.isEmpty(message)) obj.message = message;
	else obj.message = 'default error';
	if(!_.isEmpty(req)) {
		obj.request = {
			  baseUrl: req.baseUrl
			, vars: req.body
			, cookies: req.cookies
			, fresh: req.fresh
			, hostname: req.hostname
			, remote_ip: req.ip
			, original_url: req.originalUrl
			, params: req.params
			, path: req.path
			, protocol: req.protocol
			, query: req.query
			, route: req.route
			, secure: req.secure
			, subdomains: req.subdomains
			, xhr: req.xhr
		}
	}
	if(!_.isEmpty(type)) obj.type = type;
	if(!_.isEmpty(code)) obj.code = code;

	return obj;
}
