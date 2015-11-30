/**
 * BevyPanelHeader.jsx
 * formerly RightSidebar.jsx
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
var BevyActions = require('./../BevyActions');
var user = window.bootstrap.user;

var BevyPanelHeader = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    hidden: React.PropTypes.bool
  },

  getInitialState() {
    var bevy = this.props.activeBevy;
    return {
      name: bevy.name || '',
      description: bevy.description || '',
      image: bevy.image || {},
      isEditing: false
    };
  },

  componentWillReceiveProps(nextProps) {
    var bevy = nextProps.activeBevy;

    this.setState({
      name: bevy.name,
      description: bevy.description,
      image: bevy.image,
    });
  },

  startEditing(ev) {
    this.setState({
      isEditing: true
    });
  },

  stopEditing(ev) {
    var bevy_id = this.props.activeBevy.id;
    var name = this.state.name;
    var description = this.state.description;
    var image = this.state.image;

    BevyActions.update(bevy_id, name, description, image);

    this.setState({
      isEditing: false
    });
  },

  onUploadComplete(file) {
    this.setState({
      image: file
    });

    var bevy_id = this.props.activeBevy.id;
    var name = this.state.name;
    var description = this.state.description;

    BevyActions.update(bevy_id, name, description, file);
  },

  onChange(ev) {
    this.setState({
      name: this.refs.name.getValue(),
      description: this.refs.description.getValue()
    });
  },

  render() {

    var bevy = this.props.activeBevy;
    var bevyImageURL = (_.isEmpty(this.state.image)) 
      ? '/img/default_group_img.png' 
      : this.state.image.path;
    var bevyImageStyle = { backgroundImage: 'url(' + bevyImageURL + ')' };

    var name = (_.isEmpty(bevy)) 
      ? 'not in a bevy' 
      : this.state.name;
    var description = (_.isEmpty(bevy)) 
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
        <div className='profile-img' style={ bevyImageStyle }/>
      </div>
    );
    if(window.bootstrap.user) {
      if(_.findWhere(bevy.admins, { _id: window.bootstrap.user._id}) != undefined) {
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
              style={ bevyImageStyle }
              dropzoneOptions={ dropzoneOptions }
              tooltip='Change Bevy Picture'
            />
          </div>
        );
      }
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

module.exports = BevyPanelHeader;
