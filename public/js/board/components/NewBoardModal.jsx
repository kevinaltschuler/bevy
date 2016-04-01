/**
 * NewBoardModal.jsx
 *
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var Ink = require('react-ink')
var {
  Panel,
  Input,
  Button,
  Modal
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton,
  TextField,
  RadioButton
} = require('material-ui');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var getSlug = require('speakingurl');
var BoardActions = require('./../BoardActions');
var user = window.bootstrap.user;

var NewBoardModal = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: '',
      description: '',
      image: {},
      type: 'discussion'
    };
  },

  onUploadComplete(file) {
    this.setState({ image: file });
  },

  onNameChange() {
    var name = this.refs.Name.getValue();
    this.setState({ name: name });
  },

  onDescChange() {
    var desc = this.refs.Desc.getValue();
    this.setState({ description: desc });
  },

  create(ev) {
    ev.preventDefault();

    var name = this.refs.Name.getValue();
    var description = this.refs.Desc.getValue();
    var image = this.state.image;
    var parent = this.props.activeBevy._id;
    var type = this.state.type;

    if(_.isEmpty(name)) {
      this.refs.Name.setErrorText('Please enter a name for your board');
      return;
    }

    BoardActions.create(name, description, image, parent, type);

    // after, close the window
    this.hide();
  },

  hide() {
    this.setState({
      name: '',
      description: '',
      image: {},
    });
    this.props.onHide();
  },

  render() {
    if(this.props.activeBevy._id == undefined) return;

    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
      init: function() {
        this.on("addedfile", function() {
          if (this.files[1]!=null){
            this.removeFile(this.files[0]);
          }
        });
      }
    };
    var boardImageURL = (_.isEmpty(this.state.image))
      ? '/img/default_board_img.png'
      : constants.apiurl + '/files/' + this.state.image.filename;
    var boardImageStyle = {
      backgroundImage: 'url(' + boardImageURL + ')',
      backgroundSize: '100% auto'
    };

    return (
      <Modal
        show={ this.props.show }
        onHide={ this.hide }
        className="create-board"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Board For { this.props.activeBevy.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body className="board-info">
          <div className="new-board-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ boardImageStyle }
              dropzoneOptions={ dropzoneOptions }
              tooltip='Upload Board Picture'
            />
          </div>
          <span className='input-title'>
            Board Name
          </span>
          <Input
            type='text'
            ref='Name'
            placeholder='e.g., Lost and Found'
            value={ this.state.name }
            onChange={ this.onNameChange }
          />
          <span className='input-title'>
            Board Description (optional)
          </span>
          <Input
            type='text'
            ref='Desc'
            placeholder='e.g., Post your lost or found items here'
            value={ this.state.description }
            onChange={ this.onDescChange }
          />
          <div className='type-buttons'>
            <div className='section-title'>
              Board Type
            </div>
            <div className='type' onClick={() => this.setState({type: 'discussion' })}>
              <div className='type-title'>
                <RadioButton
                  label=""
                  style={{width: 15, marginRight: -10}}
                  checked={this.state.type == 'discussion'}
                  iconStyle={{fill: '#666'}}
                />
                <i className="material-icons">question_answer</i>
                Discussion
              </div>
              <div className='type-description'>
                All users may post, and no notifications will be sent to members
              </div>
            </div>
            <div className='type' onClick={() => this.setState({type: 'announcement' })}>
              <div className='type-title'>
                <RadioButton
                  label=""
                  style={{width: 15, marginRight: -10}}
                  checked={this.state.type == 'announcement'}
                  iconStyle={{fill: '#666'}}
                />
                <i className="material-icons">flag</i>
                Announcements
              </div>
              <div className='type-description'>
                Only admins can post & every post sends a notification to all members
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="panel-bottom">
          <FlatButton
            onClick={ this.hide }
            label="Cancel"
          />
          <RaisedButton
            onClick={ this.create }
            label="Create"
            style={{ marginLeft: '10px' }}
            disabled={this.state.name == '' || _.isEmpty(this.props.activeBevy)}
          />
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = NewBoardModal;
