
var mongodb = require('mongodb');

exports.up = function(db, next){

	db.createRole({
		  role: 'admin'
		, privileges: ['all']
		, roles: []
	});

    next();
};

exports.down = function(db, next){

	db.dropRole('admin');

    next();
};
