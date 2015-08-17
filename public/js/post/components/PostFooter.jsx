/**
 * PostFooter.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var {
  FlatButton
} = require('material-ui');

var CommentList = require('./CommentList.jsx');
var CommentSubmit = require('./CommentSubmit.jsx');
var CommentPanel = require('./CommentPanel.jsx');

var PostActions = require('./../PostActions');

var PostFooter = React.createClass({

  propTypes: {
    post: React.PropTypes.object
  },

  getInitialState() {
    return {
      showComments: false
    };
  },

  upvote(ev) {
    ev.preventDefault();
    PostActions.upvote(this.props.post._id, window.bootstrap.user);
  },

  downvote(ev) {
    ev.preventDefault();
    PostActions.downvote(this.props.post._id, window.bootstrap.user);
  },

  countVotes() {
    var sum = 0;
    this.props.post.votes.forEach(function(vote) {
      sum += vote.score;
    });
    return sum;
  },

  expandComments() {
    this.setState({
      showComments: !this.state.showComments
    });
  },


  render() {
    var post = this.props.post;

    var upvoteStyle = (_.find(post.votes, function(vote){ return vote.voter == window.bootstrap.user._id; }))
    ? { color: 'black' }
    : {};

    return (
      <div>
        <div className="panel-bottom">
          <div className='left'>
            <FlatButton className='upvote' onClick={ this.upvote } disabled={ _.isEmpty(window.bootstrap.user) } style={{marginRight: '10px', padding: '0px 10px'}}>
              <span className="glyphicon glyphicon-thumbs-up" style={ upvoteStyle }></span>
              &nbsp;{ this.countVotes() } upvotes
            </FlatButton>
            <FlatButton className='comment' disabled={ _.isEmpty(post.comments) } onClick={ this.expandComments } style={{marginRight: '10px', padding: '0px 10px'}}>
              <span className="glyphicon glyphicon-comment"></span>
              &nbsp;{ post.commentCount }&nbsp;comments
            </FlatButton>
          </div>
        </div>
        <CommentPanel expanded={ this.state.showComments } post={ post } />
        <div className='panel-comment-submit'>
          <CommentSubmit
            postId={ post.id }
            author={ post.author }
            bevy={ post.bevy }
            expandComments={ this.expandComments }
            showComments={ this.state.showComments }
          />
        </div>
      </div>
    );
  }
});

module.exports = PostFooter;