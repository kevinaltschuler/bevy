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
    post: React.PropTypes.object,
    showComments: React.PropTypes.bool
  },

  getInitialState() {
    return {
      showComments: this.props.showComments
    };
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

  expandComments() {
    this.setState({
      showComments: !this.state.showComments
    });
  },


  render() {
    var post = this.props.post;

    var voteButtonStyle = { marginRight: '10px', padding: '0px 10px', color: '#999' };
    var upvoted = _.find(post.votes, function(vote) {
      return (vote.voter == window.bootstrap.user._id && vote.score > 0);
    });
    if(upvoted) {
      voteButtonStyle.color = '#000'
    }

    return (
      <div>
        <div className="panel-bottom">
          <div className='left'>
            <FlatButton className='upvote' onClick={ this.vote } disabled={ _.isEmpty(window.bootstrap.user) } style={ voteButtonStyle }>
              <span className="glyphicon glyphicon-thumbs-up" ></span>
              &nbsp;{ this.countVotes() + ' ' + ((this.countVotes() == 1) ? 'like' : 'likes') }
            </FlatButton>
            <FlatButton className='comment' disabled={ _.isEmpty(post.comments) } onClick={ this.expandComments } style={{ marginRight: '10px', padding: '0px 10px' }}>
              <span className="glyphicon glyphicon-comment"></span>
              &nbsp;{ post.commentCount }&nbsp;comments
            </FlatButton>
          </div>
        </div>
        <CommentPanel expanded={ this.state.showComments } post={ post } />
        <CommentSubmit
          postId={ post.id }
          author={ post.author }
          expandComments={ this.expandComments }
          showComments={ this.state.showComments }
        />
      </div>
    );
  }
});

module.exports = PostFooter;
