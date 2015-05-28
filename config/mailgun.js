/**
 * mailgun.js
 *
 *	configure the mailgun wrapper
 *
 * @author albert
 */

'use strict';

// TODO: load this via mailgun API?
//var api_key = 'key-1abe5c471492adc2e07014a1ea3add45';
// TODO: base this off of constants siteurl?
//var domain = 'mg.bvy.io';

var api_key = 'key-1abe5c471492adc2e07014a1ea3add45';
var domain = 'mg.joinbevy.com';


module.exports = function() {
	return require('mailgun-js')({
		apiKey: api_key,
		domain: domain
	});
}

