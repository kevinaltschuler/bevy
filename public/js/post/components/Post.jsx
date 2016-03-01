/**
 * Post.jsx
 * React class for an individual post
 * Created en masse by PostContainer.jsx
 *
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  TextField,
  RaisedButton
} = require('material-ui');
var {
  Button
} = require('react-bootstrap');
var PostHeader = require('./PostHeader.jsx');
var PostImages = require('./PostImages.jsx');
var PostFooter = require('./PostFooter.jsx');
var PostBody = require('./PostBody.jsx');
var PostVideos = require('./PostVideos.jsx');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var POST = constants.POST;
var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var user = window.bootstrap.user;
var email = user.email;
var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
var maxTextHeight = 100;

var Post = React.createClass({
  propTypes: {
    post: React.PropTypes.object.isRequired,
    showComments: React.PropTypes.bool,
    searchOpen: React.PropTypes.bool,
    searchQuery: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      showComments: (router.current == 'post')
    };
  },

  getInitialState() {
    return {
      isEditing: false,
      post: this.props.post,
      title: this.props.post.title,
      images: this.props.post.images,
      height: 0
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      post: nextProps.post,
      title: nextProps.post.title,
      images: nextProps.post.images
    });
  },

  componentDidMount() {
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this.onPostChange);
  },
  componentWillUnmount() {
    PostStore.off(POST.CHANGE_ONE + this.props.post._id, this.onPostChange);
  },
  onPostChange() {
    this.setState({ post: PostStore.getPost(this.props.post._id) });
  },

  onChange(ev) {
    this.setState({ title: this.refs.title.getValue() });
  },

  startEdit(ev) {
    ev.preventDefault();
    this.setState({ isEditing: true });
  },

  stopEdit(ev) {
    ev.preventDefault();
    var title = this.state.title;
    var images = this.state.post.images;
    PostActions.update(this.props.post._id, title, images);
    this.setState({ isEditing: false });
  },

  removeImage(image) {
    var images = this.state.post.images;
    images = _.reject(images, function($image) {
      return $image.filename == image.filename;
    });
    var post = this.state.post;
    post.images = images;
    this.setState({ post: post });
  },

  addImage(file) {
    var post = this.state.post;
    post.images.push(file);
    this.setState({ post: post });
  },

  highlightLinks() {
    var title = ReactDOM.findDOMNode(this.refs.Title);
    var titleHTML = title.innerHTML;
    titleHTML = titleHTML.replace(urlRegex, function(url) {
      return '<a href="' + url + '" title="' + url + '">' + url + '</a>';
    });
    title.innerHTML = titleHTML;
  },

  render() {
    return  (
      <div
        className='post'
        postId={ this.state.post._id }
        id={ 'post:' + this.state.post._id }
      >
        <PostHeader
          post={ this.state.post }
          startEdit={ this.startEdit }
        />
        <PostBody
          post={ this.state.post }
          editing={ this.state.isEditing }
          stopEditing={ this.stopEditing }
        />
        <PostImages
          post={ this.state.post }
          isEditing={ this.state.isEditing }
          removeImage={ this.removeImage }
          addImage={ this.addImage }
        />
        <PostVideos
          post={ this.state.post }
        />
        <PostFooter
          post={ this.state.post }
          showComments={ this.props.showComments }
        />
      </div>
    );
  }
});

module.exports = Post;
