'use strict';

module.exports = function(app) {

	app.get('/login', function(req, res, next) {
		res.render('login', {});
	});

}
