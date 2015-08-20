/**
 * PostHeader.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var router = require('./../../router');

var {
  DropdownButton,
  Button,
  MenuItem,
  Badge
} = require('react-bootstrap');

var constants = require('./../../constants');
var timeAgo = require('./../../shared/helpers/timeAgo');
var timeLeft = require('./../../shared/helpers/timeLeft');
var ChatActions = require('./../../chat/ChatActions');
var PostActions = require('./../PostActions');

var PostHeader = React.createClass({

  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  onSwitchBevy(ev) {
    ev.preventDefault();
    router.navigate('/b/' + this.props.post.bevy._id, { trigger: true });
  },

  startPM(ev) {
    ev.preventDefault();
    ChatActions.startPM(this.props.post.author._id);
  },

  pin(ev) {
    ev.preventDefault();
    var post_id = this.props.post._id;
    PostActions.pin(post_id);
  },

  destroy(ev) {
    ev.preventDefault();
    PostActions.destroy(this.props.post._id);
  },

  render() {

    var post = this.props.post;
    var tag = post.tag;

    var profileImage = (post.author.image_url)
    ? post.author.image_url
    : constants.defaultProfileImage;

    var ago = timeAgo(Date.parse(post.created));
    var left = (post.expires && !post.pinned)
    ? (
      <span>
        <span className='middot'>•</span>
        { 'expires ' + timeLeft(Date.parse(post.expires)) }
      </span>
    ) : '';

    var deleteButton = '';
    if(window.bootstrap.user) {
      if(window.bootstrap.user._id == post.author._id)
        deleteButton = (
          <MenuItem onClick={ this.destroy } >
            Delete Post
          </MenuItem>
        );
    }

    var editButton = '';
    if(window.bootstrap.user) {
      if(window.bootstrap.user._id == post.author._id)
        editButton = (
          <MenuItem onClick={ this.startEdit } >
            Edit Post
          </MenuItem>
        );
    }

    var pinButton = '';
    var pinButtonText = (post.pinned) ? 'Unpin Post' : 'Pin Post';
    if(window.bootstrap.user) {
      if(window.bootstrap.user._id == post.author._id) {
        pinButton = (
          <MenuItem onClick={ this.pin }>
            { pinButtonText }
          </MenuItem>
        );
      }
    }

    var pinnedBadge = (post.pinned)
    ? <span className='badge pinned'>Pinned</span>
    : '';

    var tagBadge = (post.tag)
    ? <Badge style={{backgroundColor: tag.color}}>{tag.name}</Badge>
    : '';

    return (
      <div className='panel-header'>
        <div className='profile-img' style={{backgroundImage: 'url(' + profileImage + ')',}} />
        <div className='post-details'>
          <div className='top'>
            <span className="details">
              <Button onClick={ this.startPM }>{ post.author.displayName }</Button>
            </span>
            <span className="glyphicon glyphicon-triangle-right"/>
            <span className="details">
              <a href={ '/b/' + post.bevy._id } onClick={ this.onSwitchBevy }>{ post.bevy.name }</a>
            </span>
          </div>
          <div className="bottom">
            <span className="detail-time">{ ago }</span>
            <span className='detail-time'>{ left }</span>
          </div>
        </div>
        <div className='badges'>
          { tagBadge }
          <DropdownButton
            noCaret
            pullRight
            className="post-settings"
            title={<span className="glyphicon glyphicon-chevron-down btn"></span>}>
            { deleteButton }
            { editButton }
            { pinButton }
          </DropdownButton>
        </div>
      </div>
    );
  }
});

module.exports = PostHeader;