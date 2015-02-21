'use strict';

var mongoose = require('mongoose');

var Bevy = mongoose.model('Bevy');

// INDEX
// GET /bevies
exports.index = function(req, res, next) {
	Bevy.find().exec(function(err, bevies) {
		if(err) throw err;
		return bevies;
	}).then(function(bevies) {
		res.json({
			  status: 'INDEX BEVIES'
			, object: 'bevy array'
			, bevies: bevies
		});
	}, function(err) { next(err); });
}

// CREATE
exports.create = function(req, res, next) {

}

// SHOW
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
