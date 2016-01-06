/**
 * PostView.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  CircularProgress
} = require('material-ui');
var Post = require('./../../post/components/Post.jsx');
var Footer = require('./../../app/components/Footer.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var PostStore = require('./../../post/PostStore');
var PostActions = require('./../../post/PostActions');
var POST = constants.POST;

var PostView = React.createClass({
  propTypes: {
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {
      allPosts: PostStore.getAll(),
      postsLoaded: false
    };
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ALL, this.handleChangeAll);
    PostActions.fetchSingle(router.post_id);
  },
  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ALL, this.handleChangeAll);
  },
  handleChangeAll() {
    this.setState({
      postsLoaded: true,
      allPosts: PostStore.getAll()
    });
  },

  render() {
    if(!this.state.postsLoaded) {
      return (
        <div className='post-view'>
          <div className='loading-indeterminate'>
            <CircularProgress mode="indeterminate" />
          </div>
        </div>
      );
    }

    if(_.isEmpty(this.state.allPosts)) {
      return (
        <div className='post-view'>
          <a
            className='back-link'
            title={ 'Back to ' + this.props.activeBoard.name }
            href={ '/boards/' + this.props.activeBoard._id }
          >
            <span className='glyphicon glyphicon-triangle-left' />
            Back to&nbsp;
            <i>{ this.props.activeBoard.name }</i>
          </a>
          <span className='no-posts-text'>Post not found</span>
        </div>
      );
    }

    return (
      <div className='post-view'>
        <a
          className='back-link'
          title={ 'Back to ' + this.props.activeBoard.name }
          href={ '/boards/' + this.props.activeBoard._id }
        >
          <span className='glyphicon glyphicon-triangle-left' />
          Back to&nbsp;
          <i>{ this.props.activeBoard.name }</i>
        </a>
        <Post
          post={ this.state.allPosts[0] }
          showComments={ true }
        />
        <Footer />
      </div>
    );
  }
});

module.exports = PostView;
