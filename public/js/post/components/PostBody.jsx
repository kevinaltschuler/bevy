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
var {
  Input,
  Button
} = require('react-bootstrap');
var Ink = require('react-ink');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');

var maxTextHeight = 100;
var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;

var PostBody = React.createClass({
  propTypes: {
    post: React.PropTypes.object,
    isEditing: React.PropTypes.bool,
    stopEditing: React.PropTypes.func,
    searchOpen: React.PropTypes.bool,
    searchQuery: React.PropTypes.string
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
    // the user just opened search and searched for something
    // highlight relevant text in the post body that matches the new search query
    if(nextProps.searchOpen) {
      this.highlightSearchTerms();
    } else {
      //setTimeout(this.forceUpdate.bind(this), 250);
      this.unHighlightSearchTerms();
    }
    this.setState({
      title: nextProps.post.title
    });
  },

  componentDidMount() {
    this.measureHeight();
    this.highlightLinks();
    this.highlightSearchTerms();
  },

  onTitleChange() {
    this.setState({ title: this.refs.EditTitle.getValue() });
  },

  highlightLinks() {
    var title = ReactDOM.findDOMNode(this.refs.Title);
    var titleHTML = title.innerHTML;
    titleHTML = titleHTML.replace(urlRegex, function(url) {
      return `<a href="${url}" title="${url}" target="_blank">${url}</a>`;
    });
    title.innerHTML = titleHTML;
  },

  highlightSearchTerms() {
    // dont do this if there's an empty query
    // or if the search isn't open anyways
    /*if(!this.props.searchOpen || this.props.searchQuery.length <= 0) return;

    var title = ReactDOM.findDOMNode(this.refs.Title);
    var titleHTML = title.innerHTML;
    var queryRegex = new RegExp('' + this.props.searchQuery + '', 'gi');
    titleHTML = titleHTML.replace(queryRegex, function(query) {
      return `<span class='highlight'>${query}</span>`;
    });
    title.innerHTML = titleHTML;*/
  },

  unHighlightSearchTerms() {
    /*console.log('unhighlighting...');
    var title = ReactDOM.findDOMNode(this.refs.Title);
    var titleHTML = title.innerHTML;
    title.innerHTML = this.state.title;
    setTimeout(() => {
      this.highlightLinks();
    }, 250);*/
  },

  toggleExpanded(ev) {
    ev.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  },

  measureHeight() {
    var title = ReactDOM.findDOMNode(this.refs.Title);
    this.setState({ height: title.offsetHeight });
  },

  cancelEditing() {
    this.props.stopEditing();
  },
  saveEditing() {
    this.props.stopEditing(this.state.title);
    setTimeout(() => {
      this.measureHeight();
      this.highlightLinks();
    }, 500)
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

  renderEditing() {
    return (
      <div className='post-body editing'>
        <Input
          ref='EditTitle'
          type='textarea'
          value={ this.state.title }
          onChange={ this.onTitleChange }
          placeholder='Edit this post'
        />
        <div className='edit-buttons'>
          <Button
            className='cancel-button'
            title='Cancel editing'
            onClick={ this.cancelEditing }
          >
            <Ink />
            <span>Cancel</span>
          </Button>
          <Button
            className='save-button'
            title='Save changes'
            onClick={ this.saveEditing }
          >
            <Ink />
            <span>Save Changes</span>
          </Button>
        </div>
      </div>
    );
  },

  render() {
    // if we're editing the post, delegate rendering to the renderediting function
    if(this.props.isEditing) return this.renderEditing();

    var style = {};
    if(this.state.height > maxTextHeight && !this.state.expanded) {
      style.height = maxTextHeight;
    }

    return (
      <div className='post-body'>
        <div ref='Title' className='panel-body-text' style={ style }>
          { this.state.title }
        </div>
        { this.renderExpandButton() }
      </div>
    );
  }
});

module.exports = PostBody;
