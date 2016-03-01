/**
 * CommentPanel.jsx
 *
 * @author kev diggity dog
 * @flow
 */

'use strict';

var React = require('react');
var {
  Panel
} = require('react-bootstrap');
var CommentList = require('./CommentList.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var CommentPanel = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    expanded: React.PropTypes.bool
  },

  getInitialState() {
    return {
      expanded: this.props.expanded
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      expanded: nextProps.expanded
    });
  },

  onHandleToggle(ev) {
    ev.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  },

  render() {
    var post = this.props.post;
    var commentList = (post.comments)
    ? (
      <CommentList
        comments={ post.nestedComments }
        post={ post }
      />
    ) : '';

    return (
      <div
        className='post-comments'
        style={{
          borderBottom: (this.state.expanded && this.props.post.comments.length > 0) ? '2px solid #eee' : 'none',
          paddingBottom: (this.state.expanded && this.props.post.comments.length > 0) ? 10 : 0,
          visibility: (this.props.post.comments.length <= 0) ? 'hidden' : 'visible'
        }}
      >
        <Panel collapsible expanded={ this.state.expanded }>
          { commentList }
        </Panel>
      </div>
    );
  }
});

module.exports = CommentPanel;
