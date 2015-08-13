/**
 * CreateNewBevy.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Panel = rbs.Panel;
var Input = rbs.Input;
var Button = rbs.Button;
var Modal = rbs.Modal;

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

var BevyActions = require('./../BevyActions');
var Uploader = require('./../../shared/components/Uploader.jsx');

var user = window.bootstrap.user;

var CreateNewBevyModal = React.createClass({

  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState: function() {
    var disabled = _.isEmpty(window.bootstrap.user);

    return {
      name: '',
      description: '',
      image_url: ''
    };
  },

  onUploadComplete: function(file) {
    var filename = file.filename;
    var image_url = constants.apiurl + '/files/' + filename
    this.setState({
      image_url: image_url,
    });
  },

  create: function(ev) {
    ev.preventDefault();

    var name = this.refs.name.getValue();
    var description = this.refs.description.getValue();
    var image_url = this.state.image_url;

    if(_.isEmpty(name)) {
      this.refs.name.setErrorText('Please enter a name for your bevy');
      return;
    }

    BevyActions.create(name, description, image_url, []);

    // after, close the window
    this.props.onHide();
  },

  render: function() {

    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
    };
    var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/default_group_img.png' : this.state.image_url;
    var bevyImageStyle = {
      backgroundImage: 'url(' + bevyImage + ')',
      backgroundSize: '100% auto'

    };

    var title = (this.props.parent )
    ? 'Create a new Board of' + this.props.parent.name
    : 'Create a New Bevy'

    return (
      <Modal show={ this.props.show } onHide={ this.props.onHide } className="create-bevy">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bevy-info">
          <div className="new-bevy-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ bevyImageStyle }
              dropzoneOptions={ dropzoneOptions }
            />
          </div>
          <div className='text-fields'>
            <TextField
              type='text'
              ref='name'
              placeholder='Group Name'
            />
            <TextField
              type='text'
              ref='description'
              placeholder='Group Description'
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="panel-bottom">
          <RaisedButton
            onClick={ this.create }
            label="Create"
          />
          <FlatButton
            onClick={ this.props.onHide }
            label="Cancel"
          />
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = CreateNewBevyModal;
