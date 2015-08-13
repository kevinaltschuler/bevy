/**
 * ImageModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;
var Button = rbs.Button;

var mui = require('material-ui');
var IconButton = mui.IconButton;

var ImageModal = React.createClass({

  propTypes: {
    allImages: React.PropTypes.array.isRequired,
    index: React.PropTypes.string.isRequired,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      isModalOpen: false,
      index: this.props.index
    };
  },

  componentWillMount() {
    this.setState({
      index: this.props.index
    });
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

  render() {

    var url = this.props.allImages[this.state.index];

    var scrollButtons = (this.props.allImages.length < 2)
    ? ''
    : (
      <div>
        <IconButton iconClassName="glyphicon glyphicon-chevron-left" className='image-left-btn' onClick={ this.onLeft }/>
        <IconButton iconClassName="glyphicon glyphicon-chevron-right" className='image-right-btn' onClick={ this.onRight } />
      </div>
    );

    return (
      <Modal
        className="image-modal"
        tabIndex="0"
        onKeyDown={ this.onKeyDown }
        show={ this.props.show }
        hide={ this.props.onHide }>
        <Modal.Body>
          <div className='modal-body'>
            <img src={ this.props.allImages[this.state.index] }/>
          </div>
          { scrollButtons }
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = ImageModal;
