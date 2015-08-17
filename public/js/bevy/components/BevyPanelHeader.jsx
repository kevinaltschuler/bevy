  /**
 * BevyPanelHeader.jsx
 * formerly RightSidebar.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var constants = require('./../../constants');

var mui = require('material-ui');
var IconButton = mui.IconButton;
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;

var Uploader = require('./../../shared/components/Uploader.jsx');

var BevyActions = require('./../BevyActions');

var user = window.bootstrap.user;

var BevyPanelHeader = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
  },

  getInitialState() {

    var bevy = this.props.activeBevy;

    return {
      name: bevy.name || '',
      description: bevy.description || '',
      image_url: bevy.image_url || '',
      isEditing: false
    };
  },

  componentWillReceiveProps(nextProps) {
    var bevy = nextProps.activeBevy;

    this.setState({
      name: bevy.name,
      description: bevy.description,
      image_url: bevy.image_url,
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
    var image_url = this.state.image_url;

    BevyActions.update(bevy_id, name, description, image_url);

    this.setState({
      isEditing: false
    });
  },

  onUploadComplete(file) {
    var filename = file.filename;
    var image_url = constants.apiurl + '/files/' + filename;
    this.setState({
      image_url: image_url
    });

    var bevy_id = this.props.activeBevy.id;
    var name = this.state.name;
    var description = this.state.description;

    BevyActions.update(bevy_id, name, description, image_url);
  },

  onChange(ev) {
    this.setState({
      name: this.refs.name.getValue(),
      description: this.refs.description.getValue()
    });
  },

  render() {

    var bevy = this.props.activeBevy;
    var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/default_group_img.png' : this.state.image_url;
    var bevyImageStyle = (this.state.image_url === '/img/default_group_img.png')
    ? { backgroundImage: 'url(' + bevyImage + ')' }
    : { backgroundImage: 'url(' + bevyImage + ')' };

    var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
    var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
    if(_.isEmpty(description)) description = 'no description';

    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
    };

    var editButton = '';
    var sidebarPicture = (
      <div className="sidebar-picture">
        <div className='profile-img' style={ bevyImageStyle }/>
      </div>
    );
    if(window.bootstrap.user) {
      if(_.contains(bevy.admins, window.bootstrap.user._id)) {
        editButton = (
          <IconButton
            className="edit-button"
            tooltip='edit name'
            onClick={ this.startEditing }>
            <span className="glyphicon glyphicon-pencil btn"></span>
          </IconButton>
        );
        sidebarPicture = (
          <div className="sidebar-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ bevyImageStyle }
              dropzoneOptions={ dropzoneOptions }
            />
          </div>
        );
      }
    }

    if (this.state.isEditing) {
      return (
        <div>
          <div className="sidebar-top">
            {sidebarPicture}
            <div className="sidebar-title">
              <TextField
                type='text'
                ref='name'
                defaultValue={ name }
                value={ name }
                placeholder='Group Name'
                onKeyUp={ this.onKeyUp }
                onChange={ this.onChange }
                style={{marginLeft: '10px'}}
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
                style={{marginLeft: '10px'}}
              />
              <RaisedButton label="save" onClick={ this.stopEditing } style={{marginLeft: '10px'}} />
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
            <div>
              <span
                className='sidebar-title-name'
                onDoubleClick={ this.startEditing } >
                { name }
              </span>
              { editButton }
            </div>
            <div>
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
