/**
 * Post.jsx
 * React class for an individual post
 * Created en masse by PostContainer.jsx
 *
 * @author kevin
 * @author albert
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var router = require('./../../router');
var {
  TextField,
  RaisedButton
} = require('material-ui');

var constants = require('./../../constants');

var {
  Button
} = require('react-bootstrap');

var PostHeader = require('./PostHeader.jsx');
var PostImages = require('./PostImages.jsx');
var PostFooter = require('./PostFooter.jsx');

var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');

var POST = require('./../../constants').POST;

var $ = require('jquery');

var user = window.bootstrap.user;
var email = user.email;

var urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
var youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

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
      images: this.props.post.images
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

  render() {

    var post = this.state.post;
    var bevy = post.bevy;
    var author = post.author;
    var tag = post.tag;

    /*if(!_.isEmpty(this.state.title)) {
      var words = this.state.title.split(' ');
      var $words = [];
      var tags = post.tags;
      var urls = _.pluck(post.links, 'url');
      var videos = youtubeRegex.exec(this.state.title);
      words.forEach(function(word) {
        // take off the hashtag
        var tag = word.slice(1, word.length);
        var index = tags.indexOf(tag);
        if(index > -1) {
          return $words.push(<a href={ '/s/' + tag } key={ post._id + index + 'hash'} id={ tag } onClick={ this.onTag }>{ word } </a>);
        }
        // if this word is in the urls array
        if(!_.isEmpty(urls)) {
          index = urls.indexOf(word);
          if(index > -1) {
            return $words.push(<a href={ word } key={ post._id + index } target='_blank'>{ word + ' '}</a>);
          }
        }
        return $words.push(word + ' ');
      }.bind(this));

      // check for youtube videos
      if(!_.isEmpty(videos)) {
        videos.forEach(function(video, index) {
          if((index % 2) == 0) return;
          $words.push(<iframe width="60%" height="200px" src={"https://www.youtube.com/embed/" + video} frameborder="0" allowfullscreen={true}></iframe>);
        });
      }

      var bodyText = (<p>{ $words }</p>);
    } else bodyText = '';*/

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
      panelBodyText = (
        <div className='panel-body-text'>
          { this.state.title }
        </div>
      );
    }

    return  (
      <div className='post panel' postId={ post._id } id={ 'post:' + post._id }>
        <PostHeader post={ post } startEdit={this.startEdit} />
        <div className='panel-body'>
          { panelBodyText }
        </div>
        <PostImages post={ post } isEditing={this.state.isEditing} removeImage={this.removeImage} addImage={this.addImage} />
        <PostFooter post={ post } />
      </div>
    );
  }
});

module.exports = Post;
