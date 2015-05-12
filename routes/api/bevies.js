'use strict';

// load api functions
var api = require('./../../api');

module.exports = function(router) {

	// INDEX
	router.get('/bevies', api.bevies.index);

	// CREATE
	router.get('/bevies/create', api.bevies.create);
	router.post('/bevies', api.bevies.create);

	// SHOW
	router.get('/bevies/:id', api.bevies.show);

	// EDIT
	router.get('/bevies/:id/edit', api.bevies.update);

	// UPDATE
	router.get('/bevies/:id/update', api.bevies.update);
	router.put('/bevies/:id', api.bevies.update);
	router.patch('/bevies/:id', api.bevies.update);

	// DESTROY
	router.get('/bevies/:id/destroy', api.bevies.destroy);
	router.delete('/bevies/:id', api.bevies.destroy);

	// relative to user

	// INDEX
	router.get('/users/:userid/bevies', api.bevies.index);

	// CREATE
	router.get('/users/:userid/bevies/create', api.bevies.create);
	router.post('/users/:userid/bevies', api.bevies.create);

	// SHOW
	router.get('/users/:userid/bevies/:id', api.bevies.show);

	// EDIT
	router.get('/users/:userid/bevies/:id/edit', api.bevies.update);

	// UPDATE
	router.get('/users/:userid/bevies/:id/update', api.bevies.update);
	router.put('/users/:userid/bevies/:id', api.bevies.update);
	router.patch('/users/:userid/bevies/:id', api.bevies.update);

	// DESTROY
	router.get('/users/:userid/bevies/:id/destroy', api.bevies.destroy);
	router.delete('/users/:userid/bevies/:id', api.bevies.destroy);





	// members

	router.get('/bevies/:id/members', api.bevies.memberList);

	router.post('/bevies/:id/members', api.bevies.memberAdd);
	router.get('/bevies/:id/members/add', api.bevies.memberAdd);



	router.get('/bevies/:id/members/remove', api.bevies.memberRemove);

	router.get('/bevies/:id/members/:email', api.bevies.memberShow);

	// alias dependent

	router.get('/aliases/:aliasid/bevies/:id/members', api.bevies.memberList);

	router.post('/aliases/:aliasid/bevies/:id/members', api.bevies.memberAdd);
	router.get('/aliases/:aliasid/bevies/:id/members/add', api.bevies.memberAdd);



	router.get('/aliases/:aliasid/bevies/:id/members/remove', api.bevies.memberRemove);

	router.get('/aliases/:aliasid/bevies/:id/members/:email', api.bevies.memberShow);



};
