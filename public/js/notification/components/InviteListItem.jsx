/**
 * InviteListItem.jsx
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var {
  RaisedButton
} = require('material-ui');

var _ = require('underscore');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
var BevyActions = require('./../../bevy/BevyActions');

var InviteListItem = React.createClass({
  propTypes: {
    invite: React.PropTypes.object
  },

  acceptRequest() {
    BevyActions.acceptRequest(this.props.invite._id);
  },

  _renderImage() {
    var image_url;
    switch(this.props.invite.type) {
      case 'bevy':
        image_url = resizeImage(this.props.invite.bevy.image, 64, 64).url;
        break;
      case 'board':
        image_url = resizeImage(this.props.invite.board.image, 64, 64).url;
        break;
      default:
        image_url = constants.siteurl + '/img/logo_100.png';
        break;
    }

    var iconStyle = {
      backgroundImage: 'url(' + image_url + ')',
      backgroundSize: 'auto 100%',
      backgroundPosition: 'center',
      padding: 0,
      overflow: 'hidden',
      boxShadow: 'none',
      transition: 'all .2s ease-in-out',
      width: 40,
      height: 40,
      marginRight: 10,
      borderRadius: 20
    };

    return (
      <div
        style={ iconStyle }
      />
    );
  },

  _renderBody() {
    var target_text, action_text;
    switch(this.props.invite.type) {
      case 'bevy':
        target_text = this.props.invite.bevy.name;
        break;
      case 'board':
        target_text = this.props.invite.board.name;
        break;
      default:
        target_text = 'nuts';
        break;
    }
    switch(this.props.invite.requestType) {
      case 'request_join':
        action_text = 'Request to join';
        break;
      case 'invite':
        action_text = 'Invite to';
        break;
      default:
        action_text = 'double nuts';
        break;
    }
    return (
      <span>
        { action_text }
        &nbsp;
        <b>{ target_text }</b>
      </span>
    );
  },

  _renderAction() {
    switch(this.props.invite.requestType) {
      case 'request_join':
        return <div />
        break;
      case 'invite':
        return (
          <RaisedButton
            onClick={ this.acceptRequest }
            label='accept'
            title='Accept Invite'
          />
        );
        break;
      default:
        return <div />
        break;
    }
  },

  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 5,
        width: '100%'
      }}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          { this._renderImage() }
          { this._renderBody() }
        </div>
        { this._renderAction() }
      </div>
    );
  }
});

module.exports = InviteListItem;
