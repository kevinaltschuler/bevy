/**
 * index.js
 * @author albert
 * @flow
 */


'use strict';

module.exports = function(app) {
	require('./auth')(app);
	require('./app')(app);
}
