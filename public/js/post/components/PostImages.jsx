/**
 * PostImages.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var Ink = require('react-ink');

var {
  Button
} = require('react-bootstrap');

var ImageModal  = require('./ImageModal.jsx');

var PostImages = React.createClass({

  propTyes: {
    post: React.PropTypes.object,
    removeImage: React.PropTypes.func
  },

  getInitialState() {
    return {
      showImageModal: false,
      imageKey: 0
    };
  },

  showModal(ev) { 
    this.setState({ imageKey: ev.target.id });
    this.setState({ showImageModal: true });
  },

  render() {
    var post = this.props.post;
    var images = post.images;
    // display no more than 8 images
    if(images.length > 8) images = images.slice(0, 8);
    if(!this.props.isEditing) {
      var imageButtons = [];
      for(var key in images) {
        var url = images[key] + '?w=150&h=150';
        var more = <div />;
        if(key == 7) {
          // last image
          more = <span className='more'>+ { post.images.length - 8 } more</span>
        }
        imageButtons.push(
          <div className='panel-body-image' key={ 'postimage:' + post._id + ':' + key }>
            { more }
            <Button 
              className="image-thumbnail" 
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
        var url = images[key] + '?w=150&h=150';
        imageButtons.push(
          <div className='panel-body-image' key={ 'postimage:' + post._id + ':' + key }>
            <Button 
              className="image-thumbnail" 
              id={ key }
              style={{ backgroundImage: 'url(' + url + ')' }}
            >
              <span className='remove-btn glyphicon glyphicon-remove' onClick={() => this.props.removeImage(images[key])}>
                <Ink/>
              </span>
            </Button>
          </div>
        );
      }
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
      </div>
    );
  }
});

module.exports = PostImages;