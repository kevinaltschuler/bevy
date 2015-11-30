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
    image: {
      filename: 'http://joinbevy.com/img/default-groups/sports.png',
      foreign: true
    },
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2),
    settings: {group_chat: false},
    admins: [ 'NySs68It', 'N1ZEVPLF' ]
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '22gaming' }, {
    _id: '22gaming',
    name: 'Gaming',
    description: 'Default - Gaming',
    slug: 'gaming',
    image: {
      filename: 'http://joinbevy.com/img/default-groups/gaming.png',
      foreign: true
    },
    tags: [{name: 'general', color: '#F44336'}],
    settings: {group_chat: false},
    created: new Date(2015, 9, 2),
    admins: [ 'NySs68It', 'N1ZEVPLF' ]
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '3333pics' }, {
    _id: '3333pics',
    name: 'Pictures',
    description: 'Default - Pictures',
    slug: 'pics',
    image: {
      filename: 'http://joinbevy.com/img/default-groups/pictures.png',
      foreign: true
    },
    tags: [{name: 'general', color: '#F44336'}],
    settings: {group_chat: false},
    created: new Date(2015, 9, 2),
    admins: [ 'NySs68It', 'N1ZEVPLF' ]
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '44videos' }, {
    _id: '44videos',
    name: 'Videos',
    description: 'Default - Videos',
    slug: 'videos',
    image: {
      filename: 'http://joinbevy.com/img/default-groups/videos.png',
      foreign: true
    },
    tags: [{name: 'general', color: '#F44336'}],
    settings: {group_chat: false},
    created: new Date(2015, 9, 2),
    admins: [ 'NySs68It', 'N1ZEVPLF' ]
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '555music' }, {
    _id: '555music',
    name: 'Music',
    description: 'Default - Music',
    slug: 'music',
    image: {
      filename: 'http://joinbevy.com/img/default-groups/music.png',
      foreign: true
    },
    tags: [{name: 'general', color: '#F44336'}],
    settings: {group_chat: false},
    created: new Date(2015, 9, 2),
    admins: [ 'NySs68It', 'N1ZEVPLF' ]
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '6666news' }, {
    _id: '6666news',
    name: 'News',
    description: 'Default - News',
    slug: 'news',
    image: {
      filename: 'http://joinbevy.com/img/default-groups/news.png',
      foreign: true
    },
    tags: [{name: 'general', color: '#F44336'}],
    settings: {group_chat: false},
    created: new Date(2015, 9, 2),
    admins: [ 'NySs68It', 'N1ZEVPLF' ]
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '777books' }, {
    _id: '777books',
    name: 'Books',
    description: 'Default - Books',
    slug: 'books',
    image: {
      filename: 'http://joinbevy.com/img/default-groups/books.png',
      foreign: true
    },
    tags: [{name: 'general', color: '#F44336'}],
    settings: {group_chat: false},
    created: new Date(2015, 9, 2),
    admins: [ 'NySs68It', 'N1ZEVPLF' ]
  }, { upsert: true }, function(err, bevy) {});

});
