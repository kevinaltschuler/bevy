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

    var images = [];
    for(var key in post.images) {
      var url = post.images[key] + '?w=150&h=150';
      images.push(
        <div className='panel-body-image' key={ 'postimage:' + post._id + ':' + key } >
          <Button 
            className="image-thumbnail" 
            id={key}
            style={{ backgroundImage: 'url(' + url + ')' }}
            onClick={this.showModal}
          />
        </div>
      );
    }

    return (
      <div className="panel-body">
        { images }
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