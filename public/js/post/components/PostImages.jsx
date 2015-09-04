/**
 * PostImages.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var {
  Button
} = require('react-bootstrap');

var ImageModal  = require('./ImageModal.jsx');

var PostImages = React.createClass({

  propTyes: {
    post: React.PropTypes.object
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