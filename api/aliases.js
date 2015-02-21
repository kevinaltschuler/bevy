'use strict'

var _ = require('underscore');
var error = require('./../error');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');
var Alias = mongoose.model('Alias');

// INDEX
// GET /aliases/
exports.index = function(req, res, next) {

}

// CREATE
// GET /aliases/create
// POST /aliases
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
