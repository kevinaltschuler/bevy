'use strict';

var _ = require('underscore');

exports.log_errors = function(err, req, res, next) {
	console.error('log_errors', err.toString());
	next(err);
}
exports.client_error_handler = function(err, req, res, next) {
	console.error('client_errors', err.toString());
	res.send(500, {
		error: err.toString()
	});
	if(req.xhr) {
		console.error(err);
		res.send(500, {
			error: err.toString()
		});
	} else {
		next(err);
	}
}

//broken? something about sending the same header twice
exports.error_handler = function(err, req, res, next) {
	console.error('last_errors ', err.toString());
	res.send(500, {
		error: err.toString()
	});
}

exports.gen = function(message, route, type, code) {
	var obj = {};
	obj.object = 'error';
	if(!_.isEmpty(message)) obj.message = message;
	else obj.message = 'default error';
	if(!_.isEmpty(route)) obj.status = route;
	if(!_.isEmpty(type)) obj.type = type;
	if(!_.isEmpty(code)) obj.code = code;

	return obj;
}
