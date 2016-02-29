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
var CommentActions = require('./../CommentActions');
var user = window.bootstrap.user;

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
    if(ev)
      ev.preventDefault();

    this.setState({
      isReplying: !this.state.isReplying
    });
  },

  startPM(ev) {
    ev.preventDefault();
  },

  destroy(ev) {
    ev.preventDefault();
    CommentActions.destroy(this.props.post._id, this.props.comment._id);
  },

  onCollapse(ev) {
    this.setState({
      collapsed: !this.state.collapsed
    });
  },

  render() {
    var comment = this.props.comment;
    var author = comment.author;
    var post = this.props.post;

    var authorName = author.displayName || 'placeholder author';

    var profileImage = (_.isEmpty(author.image))
      ? constants.defaultProfileImage
      : author.image.path;

    var replyText = (this.state.isReplying)
    ? 'close'
    : 'reply';

    var submit = (this.state.isReplying)
    ? (<CommentSubmit
        postId={ post._id }
        commentId={ comment._id }
        author={ post.author }
        onReply={ this.onReply }
      />)
    : <div />;

    var commentList = (!_.isEmpty(comment.comments))
    ? (<CommentList
        comments={ comment.comments }
        post={ post }
      />)
    : '';

    var deleteButton = '';
    if(window.bootstrap.user && author._id == window.bootstrap.user._id) {
      deleteButton = (
        <a
          className='reply-link'
          title='Delete Comment'
          href='#'
          onClick={ this.destroy }
        >
          delete
        </a>
      );
    }

    var collapseBody = (this.state.collapsed)
    ? (
      <div className='comment-item'>
        <div className='comment-col collapsed' >
          <div className="comment-title" onClick={this.onCollapse}>
            <a className="comment-name">
              { authorName }
            </a>
            <div className="comment-collapse">
              <span
                className="glyphicon glyphicon-plus btn collapse-btn"
                onClick={this.onCollapse}>
              </span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className='comment-item'>
        <div className='comment-row'>
          <img className='comment-img' src={profileImage}/>
          <div className='comment-col' >
            <div className="comment-text">
              <div className="comment-title">
                <div className="comment-name">
                  <a
                    className="comment-name"
                    href="#"
                    title='Message Author'
                    onClick={ this.startPM }
                  >
                    { authorName }
                  </a>
                  &nbsp;
                  <div className="detail-time">
                    { timeAgo(Date.parse(comment.created)) }
                    &nbsp;&nbsp;
                  </div>
                  <a
                    title='Reply To Comment'
                    className="reply-link"
                    href="#"
                    onClick={ this.onReply }
                  >
                    { replyText }
                  </a>
                  &nbsp;&nbsp;
                  { deleteButton }
                </div>
                <div className="comment-collapse">
                  <span
                    className="glyphicon glyphicon-minus btn collapse-btn"
                    onClick={this.onCollapse}>
                  </span>
                </div>
              </div>
              <div className="comment-body">
                { comment.body }
              </div>
              <div className='comment-actions'>
              </div>
            </div>
          </div>
        </div>
        { submit }
        <div>
          { commentList }
        </div>
      </div>
    );

    return (
      <div>
        { collapseBody }
      </div>
    );
  }
});

module.exports = CommentItem;
