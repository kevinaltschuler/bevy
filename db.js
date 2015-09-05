/**
 * db.js
 * attempt to connect to mongodb
 * then, load all models into mongoose
 */

'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('./config');

// load models into mongoose
var models = require('./models');

// attempt connection
mongoose.connect(config.database.URL);
var connection = mongoose.connection;
connection.on('error', console.error.bind(
	  console
	, 'connection error:'
));
connection.once('open', function() {
	console.info('connected to database');

  // populate default bevies
  // sports
  // gaming
  // pics
  // videos
  // music
  // news
  // books
  var Bevy = mongoose.model('Bevy');
  var Thread = mongoose.model('ChatThread');

  Bevy.findOneAndUpdate({ _id: '11sports' }, {
    _id: '11sports',
    name: 'Sports',
    description: 'Default - Sports',
    slug: 'sports',
    image_url: '/img/default-groups/sports.png',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Thread.findOneAndUpdate({ _id: '11sports'}, {
    _id: '11sports',
    bevy: '11sports'
  }, { upsert: true }, function(err, thread) {});

  Bevy.findOneAndUpdate({ _id: '22gaming' }, {
    _id: '22gaming',
    name: 'Gaming',
    description: 'Default - Gaming',
    slug: 'gaming',
    image_url: '/img/default-groups/gaming.png',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Thread.findOneAndUpdate({ _id: '22gaming'}, {
    _id: '22gaming',
    bevy: '22gaming'
  }, { upsert: true }, function(err, thread) {});

  Bevy.findOneAndUpdate({ _id: '3333pics' }, {
    _id: '3333pics',
    name: 'Pictures',
    description: 'Default - Pictures',
    slug: 'pics',
    image_url: '/img/default-groups/pictures.png',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Thread.findOneAndUpdate({ _id: '3333pics'}, {
    _id: '3333pics',
    bevy: '3333pics'
  }, { upsert: true }, function(err, thread) {});

  Bevy.findOneAndUpdate({ _id: '44videos' }, {
    _id: '44videos',
    name: 'Videos',
    description: 'Default - Videos',
    slug: 'videos',
    image_url: '/img/default-groups/videos.png',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Thread.findOneAndUpdate({ _id: '44videos'}, {
    _id: '44videos',
    bevy: '44videos'
  }, { upsert: true }, function(err, thread) {});

  Bevy.findOneAndUpdate({ _id: '555music' }, {
    _id: '555music',
    name: 'Music',
    description: 'Default - Music',
    slug: 'music',
    image_url: '/img/default-groups/music.png',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Thread.findOneAndUpdate({ _id: '555music'}, {
    _id: '555music',
    bevy: '555music'
  }, { upsert: true }, function(err, thread) {});

  Bevy.findOneAndUpdate({ _id: '6666news' }, {
    _id: '6666news',
    name: 'News',
    description: 'Default - News',
    slug: 'news',
    image_url: '/img/default-groups/news.png',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Thread.findOneAndUpdate({ _id: '6666news'}, {
    _id: '6666news',
    bevy: '6666news'
  }, { upsert: true }, function(err, thread) {});

  Bevy.findOneAndUpdate({ _id: '777books' }, {
    _id: '777books',
    name: 'Books',
    description: 'Default - Books',
    slug: 'books',
    image_url: '/img/default-groups/books.png',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Thread.findOneAndUpdate({ _id: '777books'}, {
    _id: '777books',
    bevy: '777books'
  }, { upsert: true }, function(err, thread) {});
});
