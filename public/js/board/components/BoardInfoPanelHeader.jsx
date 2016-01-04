/**
 * InfoPanelHeader.jsx
 * @author albert
 * @author kevin
 * @flow
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
    return {
      isAdmin: _.contains(this.props.board.admins, window.bootstrap.user._id),
      name: this.props.board.name || '',
      description: this.props.board.description || 'No Description',
      image: this.props.board.image || {},
      imagePath: '',
      isEditing: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      isAdmin: _.contains(nextProps.board.admins, window.bootstrap.user._id),
      name: nextProps.board.name,
      description: nextProps.board.description,
      image: nextProps.board.image,
      imagePath: nextProps.board.image.path || ''
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

  _renderBoardImage() {
    var boardImageURL = (_.isEmpty(this.state.image))
      ? '/img/default_group_img.png'
      : this.state.imagePath;
    var boardImageStyle = { backgroundImage: 'url(' + boardImageURL + ')' };

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

    if(this.state.isAdmin) {
      return (
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
    } else {
      return (
        <div className="sidebar-picture">
          <div className='profile-img' style={ boardImageStyle }/>
        </div>
      );
    }
  },

  _renderEditButton() {
    if(!this.state.isAdmin) return <div />;
    return (
      <OverlayTrigger placement='top' overlay={
        <Tooltip id='edit-board-tooltip'>Edit Name/Description</Tooltip>
      }>
        <Button className='edit-btn' onClick={ this.startEditing }>
          <span className='glyphicon glyphicon-pencil' />
        </Button>
      </OverlayTrigger>
    );
  },

  render() {
    if (this.state.isEditing) {
      return (
        <div>
          <div className="sidebar-top">
            { this._renderBoardImage() }
            <div className="sidebar-title">
              <TextField
                type='text'
                ref='name'
                defaultValue={ this.state.name }
                value={ this.state.name }
                placeholder='Board Name'
                onKeyUp={ this.onKeyUp }
                onChange={ this.onChange }
                style={{ marginLeft: '10px', width: '90%' }}
              />
              <TextField
                type='text'
                ref='description'
                defaultValue={ this.state.description }
                value={ this.state.description }
                placeholder='Board Description'
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
          { this._renderBoardImage() }
          <div className="sidebar-title">
            <div className='sidebar-title-name-container'>
              <span
                className='sidebar-title-name'
                onDoubleClick={ this.startEditing } >
                { this.state.name }
              </span>
              { this._renderEditButton() }
            </div>
            <div className='sidebar-title-description-container'>
              <span
                className='sidebar-title-description'
                onDoubleClick={ this.startEditing } >
                { this.state.description }
              </span>
            </div>
          </div>
        </div>
      );
    }
  }
});

module.exports = InfoPanelHeader;
