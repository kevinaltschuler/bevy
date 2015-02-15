'use strict';

var constants = require('./constants');
var dispatch = require('./../shared/helpers/dispatch');

module.exports = {
	navigate: function(fragment, trigger, replace) {
		console.log('router action...', fragment);
		dispatch(constants.ROUTE_NAVIGATE, {
			  fragment: fragment
			, trigger: (trigger == undefined) ? true : trigger
			, replace: (replace == undefined) ? true : replace
		});
	}
};

