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

  Bevy.findOneAndUpdate({ _id: '11sports' }, {
    _id: '11sports',
    name: 'Sports',
    description: 'Default - Sports',
    slug: 'sports',
    image_url: 'http://www.stjosephschoolsylvania.org/sites/default/files/sports.jpg',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '22gaming' }, {
    _id: '22gaming',
    name: 'Gaming',
    description: 'Default - Gaming',
    slug: 'gaming',
    image_url: 'http://images5.fanpop.com/image/photos/30300000/Games-video-games-30388850-1920-1080.jpg',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '3333pics' }, {
    _id: '3333pics',
    name: 'Pictures',
    description: 'Default - Pictures',
    slug: 'pics',
    image_url: 'http://www.igoodmorning.net/wp-content/uploads/2015/08/Camera-Wallpapers-7.jpg',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '44videos' }, {
    _id: '44videos',
    name: 'Videos',
    description: 'Default - Videos',
    slug: 'videos',
    image_url: 'http://www.video-wallpaper.net/s/Abstraction-Video-Wallpaper.jpg',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '555music' }, {
    _id: '555music',
    name: 'Music',
    description: 'Default - Music',
    slug: 'music',
    image_url: 'http://images6.fanpop.com/image/photos/36900000/Music-Wallpaper-music-36986181-1920-1200.jpg',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '6666news' }, {
    _id: '6666news',
    name: 'News',
    description: 'Default - News',
    slug: 'news',
    image_url: 'http://desktopbackgrounds4u.com/wp-content/gallery/newspaper-wallpaper/newspaper_wallpaper_by_minuitserenite.jpg',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});

  Bevy.findOneAndUpdate({ _id: '777books' }, {
    _id: '777books',
    name: 'Books',
    description: 'Default - Books',
    slug: 'books',
    image_url: 'http://images2.alphacoders.com/261/26102.jpg',
    tags: [{name: 'general', color: '#F44336'}],
    created: new Date(2015, 9, 2)
  }, { upsert: true }, function(err, bevy) {});
});
