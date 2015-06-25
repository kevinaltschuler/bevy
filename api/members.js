'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');
var async = require('async');

var Bevy = mongoose.model('Bevy');
var Member = mongoose.model('BevyMember');

// GET /bevies/:bevyid/members
exports.index = function(req, res, next) {
	var bevy_id = req.params.bevyid;
	Member.find({ bevy: bevy_id }, function(err, members) {
		if(err) return next(err);
		return res.json(members);
	}).populate('user');
}

// POST /bevies/:bevyid/members
exports.create = function(req, res, next) {
	var bevy_id = req.params.bevyid;
	var update = {};

	if(req.body['user']) update.user = req.body['user'];
	if(req.body['email']) update.email = req.body['email'];
	if(req.body['notificationLevel']) update.notificationLevel = req.body['notificationLevel'];
	if(req.body['role']) update.role = req.body['role'];

	update.bevy = bevy_id;

	async.waterfall([
		function(done) {
			Member.find({ $and: [{ user: update.user }, { bevy: bevy_id }] }, function(err, member) {
				if(err) return next(err);
				if(!_.isEmpty(member)) done('Member already exists');
				else done(null);
			});
		},
		function(done) {
			Member.create(update, function(err, member) {
				if(err) return next(err);
				Member.populate(member, { path: 'user bevy' }, function(err, $member) {
					if(err) return next(err);
					$member = JSON.parse(JSON.stringify($member));
					Member.find({ bevy: bevy_id }, function(err, members) {
						$member.bevy.members = members;
						return res.json($member);
					});
				});
			});
		}
	], function(err, result) {
		return next(err);
	});




}

// PUT/PATCH /bevies/:bevyid/members/:id
exports.update = function(req, res, next) {
	var bevy_id = req.params.bevyid;
	var id = req.params.id;
	var update = {};

	if(req.body['user']) update.user = req.body['user'];
	if(req.body['email']) update.email = req.body['email'];
	if(req.body['displayName']) update.displayName = req.body['displayName'];
	if(req.body['image_url']) update.image_url = req.body['image_url'];
	if(req.body['notificationLevel']) update.notificationLevel = req.body['notificationLevel'];
	if(req.body['role']) update.role = req.body['role'];

	var promise = Member.findOneAndUpdate({ _id: id }, update, { new: true, upsert: true })
		.populate('user')
		.exec();
	promise.then(function(member) {
		return res.json(member);
	}, function(err) {
		return next(err);
	});
}

// DELETE /bevies/:bevyid/members/:id
exports.destroy = function(req, res, next) {
	var id = req.params.id
	var promise = Member.findOneAndRemove({ _id: id })
		.populate('bevy')
		.exec();
	promise.then(function(member) {
		return res.json(member);
	}, function(err) {
		return next(err);
	});
}
