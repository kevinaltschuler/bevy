'use strict';

function hello(req, res) {
	res.send('Hello World!');
}

module.exports = function(app) {
	app.get('/', hello);
};
