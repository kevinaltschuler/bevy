/**
 * PostHeader.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var {
  DropdownButton,
  Button,
  MenuItem,
  Badge
} = require('react-bootstrap');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var timeAgo = require('./../../shared/helpers/timeAgo');
var timeLeft = require('./../../shared/helpers/timeLeft');
var ChatActions = require('./../../chat/ChatActions');
var PostActions = require('./../PostActions');

var PostHeader = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    startEdit: React.PropTypes.func
  },

  getInitialState() {
    return {

    };
  },

  startPM(ev) {
    ev.preventDefault();
    ChatActions.startPM(this.props.post.author._id);
  },

  pin(ev) {
    ev.preventDefault();
    var post_id = this.props.post._id;
    PostActions.pin(post_id);
    this.refs.postdropdown.setState({open: false});
  },

  destroy(ev) {
    ev.preventDefault();
    PostActions.destroy(this.props.post._id);
  },

  edit(ev) {
    ev.preventDefault();
    this.props.startEdit(ev);
    this.refs.postdropdown.setState({open: false});
  },

  render() {

    var post = this.props.post;
    var tag = post.tag;

    var profileImage = (_.isEmpty(post.author.image))
      ? constants.defaultProfileImage
      : post.author.image.path;

    var ago = timeAgo(Date.parse(post.created));

    var left = Date.parse(post.expires);
    var expireText = (left == new Date('2035', '1', '1')) // dont display if it doesnt expire
    ? (
      <span>
        <span className='middot'>•</span>
        { 'expires ' + timeLeft(Date.parse(post.expires)) }
      </span>
    ) : '';

    var deleteButton = '';
    if(window.bootstrap.user) {
      if(window.bootstrap.user._id == post.author._id 
        || _.contains(post.bevy.admins, window.bootstrap.user._id))
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
          <MenuItem onClick={ this.edit } >
            Edit Post
          </MenuItem>
        );
    }

    var pinButton = '';
    var pinButtonText = (post.pinned) 
      ? 'Unpin Post' 
      : 'Pin Post';
    if(window.bootstrap.user) {
      if(_.contains(post.bevy.admins, window.bootstrap.user._id)) {
        pinButton = (
          <MenuItem onClick={ this.pin }>
            { pinButtonText }
          </MenuItem>
        );
      }
    }

    var pinnedBadge = (post.pinned)
    ? <span className='badge pinned'>PINNED</span>
    : '';

    var tagBadge = (post.tag)
    ? <Badge style={{backgroundColor: tag.color }}>{tag.name}</Badge>
    : '';

    var hideDropdown = (_.isEmpty(deleteButton) 
      && _.isEmpty(editButton) && _.isEmpty(pinButton))
    ? {display: 'none'}
    : {}

    var authorButton = (_.isEmpty(window.bootstrap.user) 
      || (post.author == window.bootstrap.user)) 
      ? (
        <div>
          { post.author.displayName }
        </div>
      ) : (
        <Button onClick={ this.startPM }>
          { post.author.displayName }
        </Button>
      );

    return (
      <div className='panel-header'>
        <div 
          className='profile-img' 
          title={ post.author.displayName } 
          style={{ backgroundImage: 'url(' + profileImage + ')' }} 
        />
        <div className='post-details'>
          <div className='top'>
            <span className="details">
              { authorButton }
            </span>
            <span className="glyphicon glyphicon-triangle-right"/>
            <span className="details">
              <a 
                className='bevy-link' 
                href={ post.bevy.url } 
                onClick={ this.onSwitchBevy }
              >
                { post.bevy.name }
              </a>
            </span>
          </div>
          <div className="bottom">
            <span className="detail-time">
              { ago }
            </span>
            <span className='detail-time'>
              { expireText }
            </span>
          </div>
        </div>
        <div className='badges'>
          { pinnedBadge }
          { tagBadge }
          <DropdownButton
            noCaret
            pullRight
            className="post-settings"
            style={hideDropdown}
            ref='postdropdown'
            title={<span className="glyphicon glyphicon-triangle-bottom btn"></span>}>
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