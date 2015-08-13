/**
 * CommentPanel.jsx
 *
 * @author kev diggity dog
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');

var CommentList = require('./CommentList.jsx');

var rbs = require('react-bootstrap');
var CollapsibleMixin = rbs.CollapsibleMixin;

var CommentPanel = React.createClass({
  mixins: [CollapsibleMixin],

  propTypes: {
    post: React.PropTypes.object,
    expanded: React.PropTypes.bool
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      expanded: nextProps.expanded
    });
  },

  getCollapsibleDOMNode() {
    return React.findDOMNode(this.refs.panel);
  },

  getCollapsibleDimensionValue() {
    return React.findDOMNode(this.refs.panel).scrollHeight;
  },

  onHandleToggle(ev) {
    ev.preventDefault();
    this.setState({expanded:!this.state.expanded});
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

    var styles = this.getCollapsibleClassSet();

    return (
      <div className='panel-comments'>
        <div ref='panel' className={classNames(styles)}>
          { commentList }
        </div>
      </div>
    );
  }
});

module.exports = CommentPanel;
