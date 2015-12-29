/**
 * InviteListItem.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');

var _ = require('underscore');
var constants = require('./../../constants');

var InviteListItem = React.createClass({
  propTypes: {
    invite: React.PropTypes.object
  },

  _renderImage() {
    var image_url;
    switch(this.props.invite.type) {
      case 'bevy':
        image_url = this.props.invite.bevy.image.path;
        break;
      case 'board':
        image_url = this.props.invite.board.image.path;
        break;
      default:
        image_url = constants.siteurl + '/img/logo_100.png';
        break;
    }
    return (
      <img
        style={{
          width: 40,
          height: 40,
          'border-radius': 20,
          'margin-right': 10
        }}
        src={ image_url }
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
        return <div />
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
        'flex-direction': 'row',
        'align-items': 'center'
      }}>
        { this._renderImage() }
        { this._renderBody() }
        { this._renderAction() }
      </div>
    );
  }
});

module.exports = InviteListItem;
