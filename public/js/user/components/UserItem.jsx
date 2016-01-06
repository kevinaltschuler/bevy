/**
 * UserItem.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');

var _ = require('underscore');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
var ChatActions = require('./../../chat/ChatActions');

var UserItem = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    linkAction: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      linkAction: 'none'
    };
  },

  onClick(ev) {
    ev.preventDefault();
    switch(this.props.linkAction) {
      case 'startPM':
        // dont start a pm with yerself
        if(this.props.user._id == window.bootstrap.user._id) return;
        ChatActions.startPM(this.props.user._id);
        break;
      case 'none':
      default:
        break;
    }
  },

  render() {
    var image_url = (_.isEmpty(this.props.user.image))
      ? constants.defaultProfileImage
      : resizeImage(this.props.user.image, 64, 64).url;
    return (
      <button
        className='user-item'
        title={ this.props.user.displayName }
        onClick={ this.onClick }
      >
        <div className='img' style={{
          backgroundImage: 'url(' + image_url + ')'
        }} />
        <span className='name'>
          { this.props.user.displayName }
        </span>
      </button>
    );
  }
});

module.exports = UserItem;
