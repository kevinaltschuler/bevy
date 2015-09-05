/**
 * ImageModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;
var Button = rbs.Button;

var mui = require('material-ui');
var IconButton = mui.IconButton;

var ImageModal = React.createClass({

  propTypes: {
    allImages: React.PropTypes.array.isRequired,
    index: React.PropTypes.any,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      index: this.props.index,
      width: 0,
      height: 0
    };
  },

  componentWillMount() {
    this.setState({
      index: this.props.index
    });
  },

  componentDidMount() {
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: nextProps.index
    });
    if(nextProps.show) this.resizeImage();
  },

  componentWillUpdate() {

  },

  componentDidUpdate() {
    //this.resizeImage();
  },

  resizeImage() {
    // load this image into code so we can measure the original width and height
    var url = this.props.allImages[this.state.index];
    var $image = new Image();
    $image.src = url;
    // once we have the image
    $image.onload = function() {
      // load the width and height
      var width = $image.width;
      var height = $image.height;
      var $width = width;
      var $height = height;
      // if its a horizontal image
      if(width > height) {
        // if it overflows the viewport width
        if(constants.viewportWidth < width) {
          // constrain the width to the viewport and give it some extra room
          $width = width - (width - constants.viewportWidth) - 120;
          // preserve the aspect ratio
          $height = height / (1 + ((width - $width) / $width));
        }
      // if its a vertical image
      } else {
        // if it overflows the viewport height
        if(constants.viewportHeight < height) {
          // constrain the height to the viewport and give it some extra room
          $height = height - (height - constants.viewportHeight) - 120;
          // preserve the aspect ratio
          $width = width / (1 + ((height - $height) / $height));
        }
      }
      this.setState({
        width: $width,
        height: $height
      });
    }.bind(this);
  },

  // triggered every time a key is pressed
  // updates the state
  handleChange() {
  },

  onLeft(ev) {
    if(this.state.index == 0) {
      this.setState({
        index: this.props.allImages.length - 1
      });
    } else {
      this.setState({
        index: --this.state.index
      });
    }
    this.resizeImage();
  },

  onRight(ev) {
    if(this.state.index == this.props.allImages.length - 1) {
      this.setState({
        index: 0
      });
    } else {
      this.setState({
        index: ++this.state.index
      });
    }
    this.resizeImage();
  },

  onKeyDown(ev) {
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
    var url = this.props.allImages[this.state.index];

    return (
      <Modal
        className="image-modal"
        tabIndex="0"
        onKeyDown={ this.onKeyDown }
        show={ this.props.show }
        onHide={ this.props.onHide }>
        <Modal.Body>
          <img id='image' src={ this.props.allImages[this.state.index] } style={{
            width: this.state.width,
            height: this.state.height
          }} />
          { this._renderLeftButton() }
          { this._renderRightButton() }
        </Modal.Body>          
      </Modal>
    );
  }
});

module.exports = ImageModal;
