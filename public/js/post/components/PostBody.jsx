/**
 * PostBody.jsx
 *
 * Body of the post. renders the title and a show more
 * button if the post is too tall
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');

var maxTextHeight = 100;
var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;

var PostBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    editing: React.PropTypes.bool,
    stopEditing: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      stopEditing: _.noop
    };
  },

  getInitialState() {
    return {
      expanded: (router.current == 'post'),
      title: this.props.post.title,
      height: 0
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.post.title
    });
  },

  componentDidMount() {
    this.measureHeight();
    this.highlightLinks();
  },

  highlightLinks() {
    var title = ReactDOM.findDOMNode(this.refs.Title);
    var titleHTML = title.innerHTML;
    titleHTML = titleHTML.replace(urlRegex, function(url) {
      return `<a href="${url}" title="${url}" target="_blank">${url}</a>`;
    });
    title.innerHTML = titleHTML;
  },

  toggleExpanded(ev) {
    ev.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  },

  measureHeight() {
    var title = ReactDOM.findDOMNode(this.refs.Title);
    this.setState({ height: title.offsetHeight });
  },

  renderExpandButton() {
    if(router.current == 'post') {
      return <div />;
    } else if(this.state.height <= maxTextHeight) {
      return <div />;
    } else if(this.state.expanded) {
      return (
        <a
          className='expand-btn'
          title='Show Less'
          href='#'
          onClick={ this.toggleExpanded }
        >
          Show Less
        </a>
      );
    } else {
      return (
        <a
          className='expand-btn'
          title='Show More'
          href='#'
          onClick={ this.toggleExpanded }
        >
          Show More
        </a>
      );
    }
  },

  render() {
    var style = {};
    if(this.state.height > maxTextHeight && !this.state.expanded) {
      style.height = maxTextHeight;
    }

    return (
      <div className='panel-body'>
        <div ref='Title' className='panel-body-text' style={ style }>
          { this.state.title }
        </div>
        { this.renderExpandButton() }
      </div>
    );
  }
});

module.exports = PostBody;
