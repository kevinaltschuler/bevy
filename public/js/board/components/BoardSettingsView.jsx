/**
 * BoardSettingsView.jsx
 *
 * View for modifying the settings of a board
 *
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Modal,
  OverlayTrigger,
  Popover,
  Input
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton
} = require('material-ui');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var router = require('./../../router');
var resizeImage = require('./../../shared/helpers/resizeImage');

var BoardActions = require('./../../board/BoardActions');

var BoardSettingsView = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object,
    activeBoard: React.PropTypes.object
  },

  getInitialState() {
    return {
      name: this.props.activeBoard.name,
      description: this.props.activeBoard.description,
      image: this.props.activeBoard.image
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.activeBoard.name,
      description: nextProps.activeBoard.description,
      image: nextProps.activeBoard.image
    });
  },

  onUploadComplete(file) {
    this.setState({ image: file });
  },

  onNameChange() {
    this.setState({ name: this.refs.Name.getValue() });
  },
  onDescChange() {
    this.setState({ description: this.refs.Description.getValue() });
  },

  goBack() {
    router.navigate(`/boards/${this.props.activeBoard._id}`, { trigger: true });
  },

  save(ev) {
    BoardActions.update(
      this.props.activeBoard._id,
      this.state.name,
      this.state.description,
      this.state.image,
      {}
    );
    this.goBack();
  },

  destroyBoard(ev) {
    ev.preventDefault();
    if(!confirm('Are you sure? Deleting a board will also remove all '
    + 'content posted to that bevy.'))
      return;

    BoardActions.destroy(this.props.activeBoard);
  },

  render() {
    var board = this.props.activeBoard;
    var settings = board.settings;

    return (
      <div className='board-settings-view'>
        <div className='header'>
          <h1 className='title'>
            Settings for <b>{ this.props.activeBoard.name }</b>
          </h1>
        </div>

        <div className='body'>
          <span className='input-title'>
            Board Name
          </span>
          <Input
            type='text'
            ref='Name'
            placeholder='Board Name'
            value={ this.state.name }
            onChange={ this.onNameChange }
          />
          <span className='input-title'>
            Board Description (optional)
          </span>
          <Input
            type='text'
            ref='Description'
            placeholder='Board Description'
            value={ this.state.description }
            onChange={ this.onDescChange }
          />

          <span className='input-title'>
            Board Image
          </span>

          <div className="new-bevy-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={{
                backgroundImage: `url(${resizeImage(this.state.image, 256, 256).url})`
              }}
              dropzoneOptions={{
                maxFiles: 1,
                acceptedFiles: 'image/*',
                clickable: '.dropzone-panel-button',
                dictDefaultMessage: ' ',
              }}
              tooltip='Change Board Picture'
            />
          </div>

          <button
            className='delete-button'
            onClick={ this.destroyBoard }
            title='Delete Board'
          >
            Delete Board
          </button>

          <div className='footer'>
            <FlatButton
              onClick={ this.goBack }
              label='Cancel'
              style={{
                marginRight: 10
              }}
            />
            <RaisedButton
              onClick={ this.save }
              label='Save'
            />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BoardSettingsView;
