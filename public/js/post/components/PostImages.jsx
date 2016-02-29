/**
 * PostImages.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink');
var {
  Button
} = require('react-bootstrap');
var {
  Snackbar
} = require('material-ui');
var ImageModal  = require('./ImageModal.jsx');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

var PostImages = React.createClass({
  propTyes: {
    post: React.PropTypes.object,
    removeImage: React.PropTypes.func,
    addImage: React.PropTypes.func
  },

  getInitialState() {
    return {
      showImageModal: false,
      imageKey: 0,
      snackbarOpen: false
    };
  },

  showModal(ev) {
    ev.preventDefault();
    this.setState({
      imageKey: ev.target.id,
      showImageModal: true,
      snackbarOpen: true
    });
  },

  closeSnackbar() {
    this.setState({ snackbarOpen: false });
  },

  render() {
    var post = this.props.post;
    var images = post.images;
    if(_.isEmpty(images)) {
      return <div/>;
    }
    var dropzoneOptions = {
      acceptedFiles: 'image/*',
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      dictDefaultMessage: 'Upload a Picture',
      addRemoveLinks: true,
      clickable: '.add-image-post'
    };
    // display no more than 8 images
    if(images.length > 8) images = images.slice(0, 8);
    if(!this.props.isEditing) {
      var imageButtons = [];
      for(var key in images) {
        var url = images[key].path + '?w=150&h=150';
        var more = <div />;
        if(key == 7 && post.images.length > 8) {
          // last image
          more = <span className='more'>+ { post.images.length - 8 } more</span>
        }
        imageButtons.push(
          <div className='panel-body-image' key={ 'postimage:' + post._id + ':' + key }>
            { more }
            <Button
              className="image-thumbnail"
              title='View Image'
              id={ key }
              style={{ backgroundImage: 'url(' + url + ')' }}
              onClick={ this.showModal }
            />
          </div>
        );
      }
    } else {
      imageButtons = [];
      for(var key in images) {
        var url = images[key].path + '?w=150&h=150';
        imageButtons.push(
          <div className='panel-body-image' key={ 'postimage:' + post._id + ':' + url }>
            <Button
              className="image-thumbnail"
              title='View Image'
              id={ key }
              style={{ backgroundImage: 'url(' + url + ')' }}
            >
              <div className='dark-overlay' />
              <span
                className='remove-btn'
                title='Remove Image'
                onClick={() => this.props.removeImage(images[key])}
              >
                <Ink/>
                <i className="material-icons">close</i>
              </span>
            </Button>
          </div>
        );
      }
      imageButtons.push(
        <div key={ 'postimage:' + post._id + ':addimage' }>
          <Uploader
            onUploadComplete={ this.props.addImage }
            dropzoneOptions={ dropzoneOptions }
            className="dropzone"
            style={{display: 'none'}}
          />
          <div className='add-image-post'>
            <Ink style={{position: 'absolute', width: '134px', height: '94px', top: '0', left: '0'}}/>
            <div className='add-btn'>
              <i className="material-icons md-48">add</i>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="post-images">
        { imageButtons }
        <ImageModal
          allImages={ post.images }
          index={ this.state.imageKey }
          show={ this.state.showImageModal }
          onHide={() => { this.setState({ showImageModal: false }); }}
        />
        <Snackbar
          ref='Snackbar'
          message='Press Esc to Close'
          open={ this.state.snackbarOpen }
          autoHideDuration={ 1500 }
          onRequestClose={ this.closeSnackbar }
        />
      </div>
    );
  }
});

module.exports = PostImages;
