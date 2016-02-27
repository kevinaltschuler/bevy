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
        className='panel-comments'
        style={{
          borderBottom: (this.state.expanded) ? '1px solid #DDD' : 'none',
          paddingBottom: (this.state.expanded) ? 10 : 0
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
