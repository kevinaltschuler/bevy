/**
 * ThreadModel.js
 * 
 * @author albert
 */

'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var Messages = require('./MessageCollection');
var constants = require('./../constants');
var BevyStore = require('./../bevy/BevyStore');

var ThreadModel = Backbone.Model.extend({
  defaults: {
  },
  idAttribute: '_id',
  initialize() {
    this.messages = new Messages;
    this.messages.url = constants.apiurl + '/threads/' + this.id + '/messages';

    if(this.get('bevy')) {
      var bevy = BevyStore.getBevy(this.get('bevy')._id);
      this.set('bevy', bevy);
    }
  },

  // get the name of the thread. 
  // will do this based on the type of the thread, 
  // or will use a hard-set name of the thread if it exists
  getName() {
    if(!_.isEmpty(this.get('name'))) return this.get('name');
    switch(this.get('type')) {
      case 'bevy':
        if(!this.get('bevy')) return '';
        var bevy = BevyStore.getBevy(this.get('bevy')._id);
        return bevy.name;
        break;
      case 'group':
        var usernames = _.pluck(this.get('users'), 'displayName');
        usernames = _.reject(usernames, function($username) {
          return $username == window.bootstrap.user.displayName; // dont put self in the thread name
        });
        var name = '';
        for(var key in usernames) {
          var username = usernames[key];
          name += username;
          if(key < usernames.length - 1) // remember to account for the current user being in the list
            name += ', ';
        }
        return name;
        break;
      case 'pm':
        var otherUser = _.find(this.get('users'), function($user) {
          return $user._id != window.bootstrap.user._id;
        });
        if(otherUser == undefined) return '';
        return otherUser.displayName;
        break;
    }
    // something went wrong or there's no thread type/name
    return '';
  },

  // get the image_url of this thread
  // does this based on the thread type
  // or will default to the hard-set one if it exists
  getImageURL() {
    var default_img = '/img/logo_100.png';
    if(!_.isEmpty(this.get('image'))) return this.get('image').path;
    switch(this.get('type')) {
      case 'bevy':
        if(!this.get('bevy')) return default_img;
        var bevy = BevyStore.getBevy(this.get('bevy')._id);
        if(_.isEmpty(bevy.image)) return default_img;
        return constants.apiurl + bevy.image.path;
        break;
      case 'group':
        // TODO: @kevin do some magic here
        return default_img;
        break;
      case 'pm':
        var otherUser = _.find(this.get('users'), function($user) {
          return $user._id != window.bootstrap.user._id;
        });
        if(otherUser == undefined) return default_img;
        if(_.isEmpty(otherUser.image_url)) return '/img/user-profile-icon.png';
        else return otherUser.image_url;
        break;
    }
    // something went wrong
    return default_img;
  }
});

module.exports = ThreadModel;
