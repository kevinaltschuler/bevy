'use strict';

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
exports.error_handler = function(err, req, res, next) {
	console.error('last_errors ', err.toString());
	res.send(500, {
		error: err.toString()
	});
}
