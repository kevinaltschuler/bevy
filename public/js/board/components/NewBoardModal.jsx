/**
 * NewBoardModal.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var constants = require('./../../constants');
var getSlug = require('speakingurl');

var Ink = require('React-Ink')

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
  Styles,
  RadioButton
} = require('material-ui');

var ThemeManager = new Styles.ThemeManager();

var BoardActions = require('./../BoardActions');
var Uploader = require('./../../shared/components/Uploader.jsx');

var user = window.bootstrap.user;

var NewBoardModal = React.createClass({

  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      name: '',
      description: '',
      image: {},
      type: 'discussion'
    };
  },

  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
      textField: {
        textColor: '#666',
        focusColor: '#666'
      },
      radioButton: {
        borderColor:  '#666',
        backgroundColor: '#fff',
        checkedColor: '#222',
        requiredColor: '#222',
        disabledColor: 'rgba(0,0,0,.2)',
        size: 24,
        labelColor: '#222',
        labelDisabledColor: 'rgba(0,0,0,.2)',
      },
    });
  },

  onUploadComplete(file) {
    this.setState({
      image: file,
    });
  },

  create(ev) {
    ev.preventDefault();

    var name = this.refs.Name.getValue();
    var description = this.refs.Description.getValue();
    var image = this.state.image;
    var parent = this.props.activeBevy._id;

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
      <Modal show={ this.props.show } onHide={ this.hide } className="create-board">
        <Modal.Header closeButton>
          <Modal.Title>New Board For "{this.props.activeBevy.name}"</Modal.Title>
        </Modal.Header>
        <Modal.Body className="board-info">
          <div className="new-board-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ boardImageStyle }
              dropzoneOptions={ dropzoneOptions }
            />
          </div>
          <div className='text-fields'>
            <TextField
              type='text'
              ref='Name'
              placeholder='Board Name'
              onChange={() => {
                this.setState({
                  name: this.refs.Name.getValue()
                });
              }}
            />
            <TextField
              type='text'
              ref='Description'
              placeholder='Board Description'
              multiLine={true}
            />
          </div>
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

NewBoardModal.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = NewBoardModal;
