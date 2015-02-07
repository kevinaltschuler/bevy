'use strict';

module.exports = function(app) {
	app.get('/users', function(req, res) {
		res.json({
			status: 'GET /users'
		});
	});
};
