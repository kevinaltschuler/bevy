/**
 * UserInviteItem.jsx
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var {
  Button
} = require('react-bootstrap');

var _ = require('underscore');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
var BevyActions = require('./../BevyActions');

var UserInviteItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object
  },

  getInitialState() {
    return {
    };
  },

  sendInvite(ev) {
    ev.preventDefault();
    var user = this.props.user;
    BevyActions.inviteUser(user);
  },

  render() {
    var user = this.props.user;

    var image_url = (_.isEmpty(user.image))
      ? constants.defaultProfileImage
      : resizeImage(user.image, 40, 40).url;
    var name = user.displayName;
    var imageStyle = {
      backgroundImage: 'url(' + image_url + ')',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center'
    };

    return (
      <Button
        className='user-search-item'
        title={ 'Invite ' + name }
        style={{
          width: '95%'
        }}
        onClick={ this.sendInvite }
      >
        <div className='image' style={ imageStyle }/>
        <div className='details'>
          <span className='name'>
            { name }
          </span>
        </div>
        <Ink style={{
          color: '#aaa',
          height: 50,
          top: 'inherit',
          marginTop: '-5px' }}
        />
      </Button>
    );
  }
});

module.exports = UserInviteItem;
