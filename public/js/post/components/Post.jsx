/**
 * Post.jsx
 * React class for an individual post
 * Created en masse by PostContainer.jsx
 *
 * @author kevin
 * @author albert
 */

'use strict';

var React = require('react');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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

var _ = require('underscore');
var $ = require('jquery');
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

// React class
var Post = React.createClass({

  propTypes: {
    post: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      isEditing: false,
      post: this.props.post,
      title: this.props.post.title,
      images: this.props.post.images,
      videos: [],
      expanded: false,
      height: 0
    };
  },

  componentWillRecieveProps(nextProps) {
    this.setState({
      post: nextProps.post,
      title: nextProps.post.title,
      images: nextProps.post.images
    });
  },

  componentDidMount() {
    // have the post rerender every minute
    // to have the "created" field update smoothly
    this.refreshInterval = setInterval(this.forceUpdate, 1000 * 60);
    PostStore.on(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);

    this.findVideos();
    this.highlightLinks();
    this.hideExtraText();
  },

  componentWillUnmount() {
    // clear the rerender interval
    if(this.refreshInterval != undefined) {
      clearInterval(this.refreshInterval);
      delete this.refreshInterval;
    }
    PostStore.off(POST.CHANGE_ONE + this.props.post._id, this._onPostChange);
  },

  _onPostChange() {
    this.setState({
      post: PostStore.getPost(this.props.post._id)
    });
  },

  onHandleToggle(ev) {
    ev.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  },

  onChange(ev) {
    this.setState({
      title: this.refs.title.getValue()
    });
  },

  startEdit(ev) {
    ev.preventDefault();
    this.setState({
      isEditing: true
    });
  },

  stopEdit(ev) {
    ev.preventDefault();
    var postTitle = this.state.title;
    var postImages = this.state.post.images;
    PostActions.update(this.props.post._id, postTitle, postImages);
    this.setState({
      isEditing: false
    });
  },

  toggleExpanded(ev) {
    ev.preventDefault();
    this.setState({
      expanded: !this.state.expanded
    });
  },

  removeImage(image_url) {
    var images = this.state.post.images;
    images = _.reject(images, function($image_url){ return $image_url == image_url });
    var post = this.state.post;
    post.images = images;
    this.setState({
      post: post
    });
  },

  addImage(file) {
    var filename = file.filename;
    //console.log(filename);
    var image_url = constants.apiurl + '/files/' + filename;
    var post = this.state.post;
    post.images.push(image_url);
    this.setState({
      post: post
    });
  },

  highlightLinks() {
    var title = React.findDOMNode(this.refs.Title);
    var titleHTML = title.innerHTML;
    titleHTML = titleHTML.replace(urlRegex, function(url) {
      return '<a href="' + url + '" title="' + url + '">' + url + '</a>';
    });
    title.innerHTML = titleHTML;
  },

  findVideos() {
    var title = this.state.post.title;
    var videoLinks = youtubeRegex.exec(title);
    var videos = [];
    //console.log(videoLinks);
    for(var key in videoLinks) {
      if(key != 1) continue;
      var videoLink = videoLinks[key];
      videos.push(
        <iframe 
          key={ 'video:' + videoLink }
          width="100%" 
          height="360px" 
          src={ "https://www.youtube.com/embed/" + videoLink } 
          frameBorder="0" 
          allowFullScreen={ true }
        />
      );
    }
    this.setState({
      videos: videos
    });
  },

  hideExtraText() {
    var title = React.findDOMNode(this.refs.Title);
    this.setState({
      height: title.offsetHeight
    });
  },

  render() {
    var post = this.state.post;
    var bevy = post.bevy;
    var author = post.author;
    var tag = post.tag;
    
    var panelBodyText;
    if(this.state.isEditing) {
      panelBodyText = (
        <div className='panel-body-text editing'>
          <TextField
            className='edit-field'
            type='text'
            ref='title'
            multiLine={true}
            defaultValue={ this.state.title  }
            value={ this.state.title  }
            style={{ width: '75%' }}
            placeholder=' '
            onChange={ this.onChange }
          />
          <RaisedButton
            label='save'
            onClick={ this.stopEdit }
            style={{marginBottom: '8px'}}
          />
        </div>
      );
    } else {
      var style = {};
      if(this.state.height > maxTextHeight && !this.state.expanded) {
        style.height = maxTextHeight;
      }

      panelBodyText = (
        <div ref='Title' className='panel-body-text' style={ style }>
          { this.state.title }
        </div>
      );
    }

    var expandButton = (this.state.expanded)
      ? <a className='expand-btn' href='#' onClick={ this.toggleExpanded }>Show Less</a>
      : <a className='expand-btn' href='#' onClick={ this.toggleExpanded }>Show More</a>;
    if(this.state.height <= maxTextHeight) expandButton = '';

    return  (
      <div className='post panel' postId={ post._id } id={ 'post:' + post._id }>
        <PostHeader post={ post } startEdit={this.startEdit} />
        <div className='panel-body'>
          { panelBodyText }
          { expandButton }
          { this.state.videos }
        </div>
        <PostImages post={ post } isEditing={this.state.isEditing} removeImage={this.removeImage} addImage={this.addImage} />
        <PostFooter post={ post } />
      </div>
    );
  }
});

module.exports = Post;
