/**
 * CommentPanel.jsx
 *
 * @author kev diggity dog
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var CommentList = require('./CommentList.jsx');

var {
  Panel
} = require('react-bootstrap');

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
        comments={ post.comments }
        post={ post }
      />
    ) : '';

    return (
      <div className='panel-comments'>
        <Panel collapsible expanded={ this.state.expanded }>
          { commentList }
        </Panel>
      </div>
    );
  }
});

module.exports = CommentPanel;
