/**
 * PostFooter.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var {
  FlatButton
} = require('material-ui');
var Ink = require('react-ink');

var CommentList = require('./CommentList.jsx');
var CommentSubmit = require('./CommentSubmit.jsx');
var CommentPanel = require('./CommentPanel.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var PostActions = require('./../PostActions');

var PostFooter = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    showComments: React.PropTypes.bool
  },

  getInitialState() {
    return { showComments: this.props.showComments };
  },

  vote(ev) {
    ev.preventDefault();
    PostActions.vote(this.props.post._id, window.bootstrap.user);
  },

  countVotes() {
    var sum = 0;
    this.props.post.votes.forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  expandComments(ev) {
    this.setState({ showComments: !this.state.showComments });
  },


  render() {
    var voteButtonStyle = {};
    var upvoted = _.find(this.props.post.votes, vote => {
      return (vote.voter == window.bootstrap.user._id && vote.score > 0);
    });
    if(upvoted) {
      voteButtonStyle.color = '#2CB673';
      voteButtonStyle.borderColor = '#2CB673';
    }

    return (
      <div className='post-footer'>
        <div className="panel-bottom">
          <button
            className='vote-button'
            title={ (upvoted) ? 'Unlike this post' : 'Like this post' }
            onClick={ this.vote }
            style={ voteButtonStyle }
          >
            <i className='material-icons'>thumb_up</i>
            <span className='text'>
              { this.countVotes() + ' ' + ((this.countVotes() == 1) ? 'like' : 'likes') }
            </span>
          </button>
          <button
            className='comment-button'
            title={ (this.state.showComments) ? 'Hide Comments' : 'View comments' }
            onClick={ this.expandComments }
          >
            <i className='material-icons'>comment</i>
            <span className='text'>
              { this.props.post.commentCount + ' comments' }
            </span>
          </button>
        </div>
        <CommentPanel
          expanded={ this.state.showComments }
          post={ this.props.post }
        />
        <CommentSubmit
          postId={ this.props.post.id }
          author={ this.props.post.author }
          expandComments={ this.expandComments }
          showComments={ this.state.showComments }
        />
      </div>
    );
  }
});

module.exports = PostFooter;
