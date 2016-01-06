/**
 * PostHeader.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  DropdownButton,
  Button,
  MenuItem,
  Badge
} = require('react-bootstrap');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
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
      isAdmin: _.contains(this.props.post.board.admins, window.bootstrap.user._id),
      isAuthor: this.props.post.author._id == window.bootstrap.user._id
    };
  },

  componentDidMount() {
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: _.contains(nextProps.post.board.admins, window.bootstrap.user._id),
      isAuthor: nextProps.post.author._id == window.bootstrap.user._id
    });
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

  copyPostURL() {
    var url = constants.siteurl + '/boards/' + this.props.post.board._id
      + '/posts/' + this.props.post._id;
    window.prompt('Copy: Ctrl-C + Enter', url);

  },

  _renderAuthorName() {
    if(this.state.isAuthor) {
      return (
        <span>
          { this.props.post.author.displayName }
        </span>
      );
    } else {
      return (
        <Button
          title={ 'Message ' + this.props.post.author.displayName }
          onClick={ this.startPM }
        >
          { this.props.post.author.displayName }
        </Button>
      );
    }
  },

  _renderPinnedBadge() {
    if(this.props.post.pinned) {
      return <span className='badge pinned'>PINNED</span>;
    } else return <div />;
  },

  _renderDeleteButton() {
    if(this.state.isAdmin || this.state.isAuthor) {
      return (
        <MenuItem onClick={ this.destroy } >
          Delete Post
        </MenuItem>
      );
    }
  },

  _renderEditButton() {
    if(this.state.isAdmin || this.state.isAuthor) {
      return (
        <MenuItem onClick={ this.edit } >
          Edit Post
        </MenuItem>
      );
    }
  },

  _renderPinButton() {
    var pinButtonText = (this.props.post.pinned)
      ? 'Unpin Post'
      : 'Pin Post';
    if(this.state.isAdmin) {
      return (
        <MenuItem onClick={ this.pin }>
          { pinButtonText }
        </MenuItem>
      );
    }
  },

  render() {
    var post = this.props.post;

    var profileImageURL = (_.isEmpty(this.props.post.author.image))
      ? constants.defaultProfileImage
      : resizeImage(this.props.post.author.image, 64, 64).url;

    return (
      <div className='panel-header'>
        <div
          className='profile-img'
          title={ this.props.post.author.displayName }
          style={{ backgroundImage: 'url(' + profileImageURL + ')' }}
        />
        <div className='post-details'>
          <div className='top'>
            <span className="details">
              { this._renderAuthorName() }
            </span>
            <span className="glyphicon glyphicon-triangle-right"/>
            <span className="details">
              <a
                className='bevy-link'
                title={ this.props.post.board.name }
                href={ this.props.post.board.url }
              >
                { this.props.post.board.name }
              </a>
            </span>
          </div>
          <div className="bottom">
            <span className="detail-time">
              { timeAgo(Date.parse(this.props.post.created)) }
            </span>
            <span className='detail-time'>
              { (Date.parse(this.props.post.expires) == new Date('2035', '1', '1'))
                ? (
                  <span>
                    <span className='middot'>•</span>
                    { 'expires ' + timeLeft(Date.parse(this.props.post.expires)) }
                  </span>
                ) : <div />
              }
            </span>
          </div>
        </div>
        <div className='badges'>
          { this._renderPinnedBadge() }
          <DropdownButton
            id='post-settings-dropdown'
            noCaret
            pullRight
            className="post-settings"
            ref='postdropdown'
            title={
              <span className="glyphicon glyphicon-triangle-bottom btn" />
            }
          >
            { this._renderDeleteButton() }
            { this._renderEditButton() }
            { this._renderPinButton() }
            <MenuItem
              onClick={ this.copyPostURL }>
              Copy Post URL
            </MenuItem>
          </DropdownButton>
        </div>
      </div>
    );
  }
});

module.exports = PostHeader;
