
var mongodb = require('mongodb');

exports.up = function(db, next){

	var users = mongodb.Collection(db, 'users');

	users.insert({
		  _id: 1
		, token: ''
		, display_name: 'foobar'
		, password: 'foobar'
		, email: 'foobar@example.com'
		, created: Date.now
		, updated: Date.now
	}, next);

    next();
};

exports.down = function(db, next){
    next();
};
