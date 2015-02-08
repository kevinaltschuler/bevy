
var mongodb = require('mongodb');

exports.up = function(db, next){

	var users = mongodb.Collection(db, 'users');



    next();
};

exports.down = function(db, next){
    next();
};
