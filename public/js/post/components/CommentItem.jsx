/**
 * CommentItem.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var CommentSubmit = require('./CommentSubmit.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var timeAgo = require('./../../shared/helpers/timeAgo');
var resizeImage = require('./../../shared/helpers/resizeImage');

var CommentActions = require('./../../post/CommentActions');
var AppActions = require('./../../app/AppActions');

var CommentList = React.createClass({
  propTypes: {
    comments: React.PropTypes.array,
    post: React.PropTypes.object
  },

  render() {
    var allComments = this.props.comments;
    var comments = [];
    allComments.forEach(function(comment, index) {
      comments.push(
        <CommentItem
          key={ index }
          comment={ comment }
          post={ this.props.post }
          activeMember={ this.props.activeMember }
        />
      );
    }.bind(this));

    return (
      <div className="comment-list">
        { comments }
      </div>
    );
  }

});

var CommentItem = React.createClass({
  propTypes: {
    comment: React.PropTypes.object.isRequired,
    post: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isReplying: false,
      collapsed: false
    };
  },

  onReply(ev) {
    if(ev) ev.preventDefault();
    this.setState({ isReplying: !this.state.isReplying });
  },

  goToAuthorProfile(ev) {
    if(ev) ev.preventDefault();
    AppActions.openSidebar('profile', {
      profileUser: this.props.comment.author
    });
  },

  destroy(ev) {
    ev.preventDefault();
    CommentActions.destroy(this.props.post._id, this.props.comment._id);
  },

  onCollapse(ev) {
    if(ev) ev.preventDefault();
    this.setState({ collapsed: !this.state.collapsed });
  },

  renderCollapsed() {
    return (
      <div className='comment-item collapsed'>
        <div className='comment-row collapsed'>
          <div className='comment-col collapsed' >
            <div className='comment-title'>
              <button
                className='comment-name'
                title='Expand comment'
                href='#'
                onClick={ this.onCollapse }
              >
                { this.props.comment.author.displayName }
              </button>
              <span className='time-ago'>
                { timeAgo(Date.parse(this.props.comment.created)) }
              </span>
              <span className='reply-count'>
                { this.props.comment.comments.length } replies
              </span>
            </div>
          </div>
          <button
            className='comment-collapse'
            onClick={ this.onCollapse }
            title='Expand comment'
          >
            <span className='brackets'>[</span>
            <i className='material-icons'>add</i>
            <span className='brackets'>]</span>
          </button>
        </div>
      </div>
    );
  },

  renderDeleteButton() {
    if(this.props.comment.author._id == window.bootstrap.user._id) {
      return (
        <a
          className='reply-link'
          title='Delete comment'
          href='#'
          onClick={ this.destroy }
        >
          delete
        </a>
      );
    } else return <div />;
  },

  renderCommentSubmit() {
    if(this.state.isReplying) {
      return (
        <CommentSubmit
          postId={ this.props.post._id }
          commentId={ this.props.comment._id }
          author={ this.props.post.author }
          onReply={ this.onReply }
        />
      );
    } else return <div />;
  },

  renderCommentList() {
    if(!_.isEmpty(this.props.comment.comments)) {
      return (
        <CommentList
          comments={ this.props.comment.comments }
          post={ this.props.post }
        />
      );
    } else {
      return <div />;
    }
  },

  render() {
    if(this.state.collapsed) return this.renderCollapsed();

    return (
      <div className='comment-item'>
        <div className='comment-row'>
          <div
            className='comment-img'
            style={{
              backgroundImage: `url(${resizeImage(this.props.comment.author.image, 128, 128).url })`
            }}
          />
          <div className='comment-col'>
            <div className='comment-text'>
              <div className='comment-title'>
                <div className='comment-name'>
                  <a
                    className='comment-name'
                    href='#'
                    title={`View ${this.props.comment.author.displayName}'s Profile`}
                    onClick={ this.goToAuthorProfile }
                  >
                    { this.props.comment.author.displayName }
                  </a>
                  &nbsp;
                  <div className='detail-time'>
                    { timeAgo(Date.parse(this.props.comment.created)) }
                    &nbsp;&nbsp;
                  </div>
                  <a
                    title='Reply to comment'
                    className='reply-link'
                    href='#'
                    onClick={ this.onReply }
                  >
                    { (this.state.isReplying) ? 'close' : 'reply' }
                  </a>
                  &nbsp;&nbsp;
                  { this.renderDeleteButton() }
                </div>
              </div>
              <div className='comment-body'>
                { this.props.comment.body }
              </div>
            </div>
          </div>
          <button
            className='comment-collapse'
            onClick={ this.onCollapse }
            title='Hide comment and replies'
          >
            <span className='brackets'>[</span>
            <i className='material-icons'>remove</i>
            <span className='brackets'>]</span>
          </button>
        </div>
        { this.renderCommentSubmit() }
        { this.renderCommentList() }
      </div>
    );
  }
});

module.exports = CommentItem;
