/**
 * controllers/events.js
 *
 * endpoint functions for bevy events
 *
 * @author albert
 * @flow
 */

'use strict';

var _ = require('underscore');
var mongoose = require('mongoose');

var Event = require('./../models/Event');
var Bevy = require('./../models/Bevy');

var authorPopFields = '_id displayName email image username \
  google facebook created name title points commentCount postCount';

// GET /bevies/:bevyid/events
var getBevyEvents = function(req, res, next) {
  var bevy_id = req.params.bevyid;
  Event.find({ bevy: bevy_id }, function(err, events) {
    if(err) return next(err);
    return res.json(events);
  })
  .populate({
    path: 'author',
    select: authorPopFields
  })
  .sort('-created');
};
exports.getBevyEvents = getBevyEvents;

// POST /events
// POST /bevies/:bevyid/events
var createEvent = function(req, res, next) {
  var bevy_id = req.body['bevy'];
  var author_id = req.body['author'];
  var title = req.body['title'];
  var start = req.body['start'];
  var end = req.body['end'];
  var location = req.body['location'];
  var description = req.body['description'];
  var cap = req.body['cap'];

  if(bevy_id == undefined) return next('Bevy ID must be specified');
  if(author_id == undefined) return next('Author ID must be specified');
  if(title == undefined) return next('Event title must be specified');
  if(start == undefined) return next('Start date must be specified');

  var new_event = {
    _id: shortid.generate(),
    bevy: bevy_id,
    author: author_id,
    title: title,
    start: start,
    end: (end == undefined) ? null : end,
    location: (location == undefined) ? null : location,
    description: (description == undefined) ? null : description,
    cap: (cap == undefined) ? -1 : cap
  };
  Event.create(new_event, function(err, event) {
    if(err) return next(err);
    return res.json(event);
  });
};
exports.createEvent = createEvent;

// GET /events/:eventid
var getEvent = function(req, res, next) {
  var event_id = req.params.eventid;
  Event.findOne({ _id: event_id }, function(err, event) {
    if(err) return next(err);
    return res.json(event);
  })
  .populate({
    path: 'author',
    select: authorPopFields
  });
};
exports.getEvent = getEvent;

// PUT/PATCH /events/:eventid
var updateEvent = function(req, res, next) {
  var event_id = req.params.eventid;
  var update = {};
  if(req.body['title'] != undefined) update.title = req.body['title'];
  if(req.body['start'] != undefined) update.start = req.body['start'];
  if(req.body['end'] != undefined) update.end = req.body['end'];
  if(req.body['location'] != undefined) update.location = req.body['location'];
  if(req.body['description'] != undefined) update.description = req.body['description'];
  if(req.body['cap'] != undefined) update.cap = req.body['cap'];

  Event.findOneAndUpdate({ _id: event_id }, update, { new: true }, function(err, event) {
    if(err) return next(err);
    return res.json(event);
  })
  .populate({
    path: 'author',
    select: authorPopFields
  });
};
exports.updateEvent = updateEvent;

// DELETE /events/:eventid
var destroyEvent = function(req, res, next) {
  var event_id = req.params.eventid;
  Event.findOneAndRemove({ _id: event_id }, function(err, event) {
    if(err) return next(err);
    return res.json(event);
  })
  .populate({
    path: 'author',
    select: authorPopFields
  });
};
exports.destroyEvent = destroyEvent;
