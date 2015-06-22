'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	router.get('/bevies/:bevyid/members', api.members.index);

	router.post('/bevies/:bevyid/members', api.members.create);

	router.put('/bevies/:bevyid/members/:id', api.members.update);
	router.patch('/bevies/:bevyid/members/:id', api.members.update);

	router.delete('/bevies/:bevyid/members/:id', api.members.destroy);
}
