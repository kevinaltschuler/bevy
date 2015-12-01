/**
 * ImageModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Modal,
  Button
} = require('react-bootstrap');
var {
  IconButton
} = require('material-ui');

var _ = require('underscore');
var $ = require('jquery');
var constants = require('./../../constants');

var ImageModal = React.createClass({
  propTypes: {
    allImages: React.PropTypes.array,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      allImages: [],
      show: false,
      onHide: _.noop
    };
  },

  getInitialState() {
    this.index = 0;
    return {
      index: this.props.index,
      width: 0,
      height: 0
    };
  },

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  },

  componentWillReceiveProps(nextProps) {
    this.index = nextProps.index;
    this.setState({
      index: nextProps.index
    });
    this.resizeImage();
  },

  handleWindowResize() {
    constants.viewportWidth = window.innerWidth;
    constants.viewportHeight = window.innerHeight;
    this.resizeImage();
  },

  // resize the image so it can fit on screen, 
  // or blow it up so it's easier to see
  resizeImage() {
    var image = this.props.allImages[this.index];

    // load the width and height
    var width = image.geometry.width;
    var height = image.geometry.height;
    var $width = width;
    var $height = height;
    // if its a horizontal image
    if(image.orientation == 'landscape') {
      // if it overflows the viewport width
      if((constants.viewportWidth - 120) < width) {
        // constrain the width to the viewport and give it some extra room
        $width = width - (width - constants.viewportWidth) - 120;
        // preserve the aspect ratio
        $height = height / (1 + ((width - $width) / $width));
      }
    } 
    // if its a vertical image or if it still overflows
    if(image.orientation == 'portrait' || $height > constants.viewportHeight) {
      // if it overflows the viewport height
      if((constants.viewportHeight - 120) < height) {
        // constrain the height to the viewport and give it some extra room
        $height = height - (height - constants.viewportHeight) - 120;
        // preserve the aspect ratio
        $width = width / (1 + ((height - $height) / $height));
      }
    }
    // trigger re-render
    this.setState({
      width: $width,
      height: $height
    });
  },

  onLeft(ev) {
    var index = this.state.index;
    if(index == 0) {
      index = this.props.allImages.length - 1;
    } else {
      index--;
    }
    this.index = index;
    this.setState({
      index: index
    });
    this.resizeImage();
  },

  onRight(ev) {
    var index = this.state.index;
    if(index == this.props.allImages.length - 1) {
      index = 0;
    } else {
      index++;
    }
    this.index = index;
    this.setState({
      index: index
    });
    this.resizeImage();
  },

  onKeyDown(ev) {
    ev.preventDefault();
    if(this.props.allImages.length < 2) return;
    if(ev.which == 37) {
      // left
      this.onLeft();
    } else if (ev.which == 39) {
      // right
      this.onRight();
    }
  },

  _renderLeftButton() {
    if(this.props.allImages.length < 2) return <div />;
    return (
      <Button 
        className='image-left-btn' 
        onClick={ this.onLeft } >
        <span className="glyphicon glyphicon-triangle-left" />
      </Button>
    );
  },

  _renderRightButton() {
    if(this.props.allImages.length < 2) return <div />;
    return (
      <Button 
        className='image-right-btn' 
        onClick={ this.onRight } >
        <span className="glyphicon glyphicon-triangle-right" />
      </Button>
    );
  },

  render() {
    var url = (_.isEmpty(this.props.allImages[this.index]))
      ? '/img/logo_100.png'
      : this.props.allImages[this.index].path;

    return (
      <Modal
        className="image-modal"
        tabIndex="0"
        onKeyDown={ this.onKeyDown }
        show={ this.props.show }
        onHide={ this.props.onHide }>
        <Modal.Body>
          <img 
            id='image' 
            src={ url } 
            style={{
              width: this.state.width,
              height: this.state.height
            }}
          />
          { this._renderLeftButton() }
          { this._renderRightButton() }
          <span className='counter'>
            { parseInt(this.state.index) + 1 
             + '/'
             + this.props.allImages.length }
          </span>
        </Modal.Body>          
      </Modal>
    );
  }
});

module.exports = ImageModal;
