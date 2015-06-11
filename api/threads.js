'use strict';

var mongoose = require('mongoose');
var async = require('async');
var _ = require('underscore');

var ChatThread = mongoose.model('ChatThread');
var Bevy = mongoose.model('Bevy');


// GET /users/:id/threads
exports.index = function(req, res, next) {
	var id = req.params.id;

	async.waterfall([
		function(done) {
			Bevy.find({ members: { $elemMatch: { user: id } } }, function(err, bevies) {
				done(null, bevies);
			});
		},
		function(bevies, done) {
			var bevy_id_list = _.pluck(bevies, '_id');

			ChatThread.find(function(err, threads) {
				return res.json(threads);
			}).or([{ users: { $elemMatch: { $eq: id } } }, { bevy: { $in: bevy_id_list } }])
			.populate('bevy');
		}
	]);
}

exports.create = function(req, res, next) {

}

exports.update = function(req, res, next) {

}

exports.destroy = function(req, res, next) {

}
