
var mongodb = require('mongodb');

exports.up = function(db, next){

	mongodb.createRole({
		  role: 'admin'
		, privileges: ['all']
		, roles: []
	});

    next();
};

exports.down = function(db, next){

	mongodb.dropRole('admin');

    next();
};
