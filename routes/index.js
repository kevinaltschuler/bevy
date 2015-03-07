'use strict';

module.exports = function(app) {

	require('./auth')(app);

	require('./app')(app);
}
