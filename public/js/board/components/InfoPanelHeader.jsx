/**
 * InfoPanelHeader.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  IconButton,
  TextField,
  RaisedButton
} = require('material-ui');
var {
  Button,
  Tooltip,
  OverlayTrigger
} = require('react-bootstrap');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var BoardActions = require('./../BoardActions');
var user = window.bootstrap.user;

var InfoPanelHeader = React.createClass({
  propTypes: {
    board: React.PropTypes.object,
    hidden: React.PropTypes.bool
  },

  getInitialState() {
    var board = this.props.board;
    return {
      name: board.name || '',
      description: board.description || '',
      image: board.image || {},
      imagePath: '',
      isEditing: false
    };
  },

  componentWillReceiveProps(nextProps) {
    var board = nextProps.board;

    this.setState({
      name: board.name,
      description: board.description,
      image: board.image,
      imagePath: board.image.path || ''
    });
  },

  startEditing(ev) {
    this.setState({
      isEditing: true
    });
  },

  stopEditing(ev) {
    var board_id = this.props.board.id;
    var name = this.state.name;
    var description = this.state.description;
    var image = this.state.image;

    BoardActions.update(board_id, name, description, image);

    this.setState({
      isEditing: false
    });
  },

  onUploadComplete(file) {
    console.log(file);
    this.setState({
      image: file,
      imagePath: constants.apiurl + '/files/' + file.filename
    });

    var board_id = this.props.board.id;
    var name = this.state.name;
    var description = this.state.description;

    BoardActions.update(board_id, name, description, file);
  },

  onChange(ev) {
    this.setState({
      name: this.refs.name.getValue(),
      description: this.refs.description.getValue()
    });
  },

  render() {

    var board = this.props.board;
    var isAdmin = _.contains(board.admins, window.bootstrap.user._id);
    var boardImageURL = (_.isEmpty(this.state.image)) 
      ? '/img/default_group_img.png' 
      : this.state.imagePath;
    console.log(boardImageURL);
    var boardImageStyle = { backgroundImage: 'url(' + boardImageURL + ')' };

    var name = (_.isEmpty(board)) 
      ? 'not in a board' 
      : this.state.name;
    var description = (_.isEmpty(board)) 
      ? 'no description' 
      : this.state.description;
    if(_.isEmpty(description)) description = 'no description';

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
    var editButton = '';
    var sidebarPicture = (
      <div className="sidebar-picture">
        <div className='profile-img' style={ boardImageStyle }/>
      </div>
    );
    if(isAdmin) {
      editButton = (
        <OverlayTrigger placement='top' overlay={
          <Tooltip>Edit Name/Description</Tooltip>
        }>
          <Button className='edit-btn' onClick={ this.startEditing }>
            <span className='glyphicon glyphicon-pencil' />
          </Button>
        </OverlayTrigger>
      );
      sidebarPicture = (
        <div className="sidebar-picture">
          <Uploader
            onUploadComplete={ this.onUploadComplete }
            className="bevy-image-dropzone"
            style={ boardImageStyle }
            dropzoneOptions={ dropzoneOptions }
            tooltip='Change Board Picture'
          />
        </div>
      );
    }
    if (this.state.isEditing) {
      return (
        <div>
          <div className="sidebar-top">
            { sidebarPicture }
            <div className="sidebar-title">
              <TextField
                type='text'
                ref='name'
                defaultValue={ name }
                value={ name }
                placeholder='Group Name'
                onKeyUp={ this.onKeyUp }
                onChange={ this.onChange }
                style={{ marginLeft: '10px', width: '90%' }}
              />
              <TextField
                type='text'
                ref='description'
                defaultValue={ description }
                value={ description }
                placeholder='Group Description'
                onKeyUp={ this.onKeyUp }
                onChange={ this.onChange }
                multiLine= { true }
                style={{ marginLeft: '10px', width: '90%' }}
              />
              <RaisedButton 
                label="save" 
                onClick={ this.stopEditing } 
                style={{ 
                  marginLeft: '10px', 
                  width: '90%', 
                  marginBottom: '10px', 
                  marginTop: '5px'
                }} 
              />
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="sidebar-top">
          { sidebarPicture }
          <div className="sidebar-title">
            <div className='sidebar-title-name-container'>
              <span
                className='sidebar-title-name'
                onDoubleClick={ this.startEditing } >
                { name }
              </span>
              { editButton }
            </div>
            <div className='sidebar-title-description-container'>
              <span
                className='sidebar-title-description'
                onDoubleClick={ this.startEditing } >
                { description }
              </span>
            </div>
          </div>
        </div>
      );
    }
  }
});

module.exports = InfoPanelHeader;
