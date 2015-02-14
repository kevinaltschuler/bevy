'use strict';

module.exports = function(app) {
	app.get('/app', function(req, res, next) {
		res.render('app', {});
	});
}
