/**
 * CommentList.jsx
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var CommentItem = require('./CommentItem.jsx');

var CommentList = React.createClass({
  propTypes: {
    comments: React.PropTypes.array,
    post: React.PropTypes.object,
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

module.exports = CommentList;
