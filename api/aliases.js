'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');
var Alias = mongoose.model('Alias');

// INDEX
exports.index = function(req, res, next) {
	var user_id = req.params.id;
	var user_object_id = ObjectId.createFromHexString(user_id);

	var user_query = { _id: user_object_id };
	User.findOne(user_query, function(err, user) {
		if(err) throw err;
		if(!user) {
			var err = error.gen('user not found', req);
			next(err);
		}

		var aliases = user.aliases;
		res.json({
			  status: 'GET /user/' + user_id + '/aliases/'
			, object: 'alias array'
			, aliases: aliases
		});
	});
}

// CREATE
exports.create = function(req, res, next) {
	var user_id = req.params.id;
	var user_object_id = ObjectId.createFromHexString(user_id);

	var user_query = { _id: user_object_id };
}

// SHOw
exports.show = function(req, res, next) {

}

// EDIT
exports.edit = function(req, res, next) {

}

// UPDATE
exports.update = function(req, res, next) {

}

// DESTROY
exports.destroy = function(req, res, next) {

}
