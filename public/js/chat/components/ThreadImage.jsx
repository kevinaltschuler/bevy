/**
 * ThreadImage.jsx
 * @author albert
 */

'use strict';

var React = require('react');

var _ = require('underscore');
var constants = require('./../../constants');
var ChatStore = require('./../ChatStore');

var ThreadImage = React.createClass({

  propTypes: {
    thread: React.PropTypes.object.isRequired
  },

  _renderSingleImage() {
    var image_url = ChatStore.getThreadImageURL(this.props.thread._id);
    var imageStyle = {
      backgroundImage: 'url(' + image_url + ')',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center',
      minWidth: 40,
      minHeight: 40,
      width: 40,
      height: 40,
      padding: 0,
      overflow: 'hidden',
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 50,
      boxShadow: 'none',
      transition: 'all .2s ease-in-out'
    };
    return (
      <div style={ imageStyle } />
    );
  },

  render() {
    switch(this.props.thread.type) {
      case 'bevy':
      case 'pm':
        return this._renderSingleImage();
      case 'group':
        if(this.props.thread.image) {
          // if theres a set image, use that instead
          return this._renderSingleImage();
        }
        var users = [];
        var threadUsers = _.reject(this.props.thread.users, function($user) {
          // dont render self
          return $user._id == window.bootstrap.user._id;
        });
        for(var key in threadUsers) {
          if(key > 3) continue; // limit these icons to 4
          var user = threadUsers[key];
          var image_url = (_.isEmpty(user.image))
            ? constants.defaultProfileImage
            : user.image.path
          var iconStyle = {
            backgroundImage: 'url(' + image_url + ')',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center',
            padding: 0,
            overflow: 'hidden',
            boxShadow: 'none',
            transition: 'all .2s ease-in-out'
          };
          switch(threadUsers.length) {
            case 1:
              // only one other user
              iconStyle.minWidth = 40;
              iconStyle.minHeight = 40;
              iconStyle.borderRadius = 20;
              break;
            case 2:
              // two other users
              iconStyle.minWidth = 26;
              iconStyle.minHeight = 26;
              iconStyle.borderRadius = 13;
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top left
                iconStyle.top = 0;
                iconStyle.left = 0;
              } else {
                // second user - bottom right
                iconStyle.bottom = 0;
                iconStyle.right = 0;
              }
              break;
            case 3:
              // 3 other users
              iconStyle.minWidth = 20;
              iconStyle.minHeight = 20;
              iconStyle.borderRadius = 10;
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top center
                iconStyle.top = 0;
                iconStyle.left = 10;
              } else if (key == 1) {
                // second user - bottom left
                iconStyle.bottom = 0;
                iconStyle.left = 0;
              } else if (key == 2) {
                // third user - bottom right
                iconStyle.bottom = 0;
                iconStyle.right = 0;
              }
              break;
            case 4:
              // 4 other users
              iconStyle.minWidth = 20;
              iconStyle.minHeight = 20;
              iconStyle.borderRadius = 10;
              iconStyle.position = 'absolute';
              if(key == 0) {
                // first user - top left
                iconStyle.top = 0;
                iconStyle.left = 0;
              } else if (key == 1) {
                // second user - top right
                iconStyle.top = 0;
                iconStyle.right = 0;
              } else if (key == 2) {
                // third user - bottom left
                iconStyle.bottom = 0;
                iconStyle.left = 0;
              } else {
                // fourth user - bottom right
                iconStyle.bottom = 0;
                iconStyle.right = 0;
              }
              break;
          }
          users.push(
            <div key={ 'threadimage:user:' + user._id } style={ iconStyle }/>
          );
        }
        
        return (
          <div style={{
            position: 'relative',
            minWidth: 40,
            minHeight: 40,
            borderRadius: 20,
            marginRight: 10,
            marginLeft: 10
          }}>
            { users }
          </div>
        );
    }
  }
});

module.exports = ThreadImage;