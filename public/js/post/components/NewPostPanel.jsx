/**
 * NewPostPanel.jsx
 *
 * The dialog for creating a post
 *
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Button,
  Tooltip,
  OverlayTrigger
} = require('react-bootstrap');
var {
  TextField,
  DropDownMenu,
  MenuItem,
  CircularProgress
} = require('material-ui');
var Ink = require('react-ink');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var POST = constants.POST;

var NewPostPanel = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object.isRequired,
    activeBoard: React.PropTypes.object.isRequired,
    boards: React.PropTypes.array.isRequired
  },

  getInitialState() {
    let disabled = false;
    let hintText = constants.hintTexts[Math.floor(Math.random() * constants.hintTexts.length)];
    // if this is an announcement board and the user is not an admin
    if(this.props.activeBoard.type == 'announcement'
      && _.findWhere(this.props.activeBoard.admins,
        { _id: window.bootstrap.user._id }) == undefined) {
      disabled = true;
      hintText = 'Only admins can post in an announcement board';
    }

    return {
      title: '',
      images: [],
      showEventModal: false,
      hintText: hintText,
      disabled: disabled,
      loading: false
    };
  },

  componentDidMount() {
    PostStore.on(POST.POSTED_POST, this.onPostSuccess);
  },

  onPostSuccess() {
    this.setState({ loading: false });
  },

  componentWillReceiveProps(nextProps) {

  },

  onUploadComplete(file) {
    var images = this.state.images;
    images.push(file);
    this.setState({
      images: images
    });
  },

  onRemovedFile(file) {
    var filename = JSON.parse(file.xhr.response).filename;
    var images = this.state.images;
    images = _.reject(images, function($image) {
      return $image.filename == filename;
    });
    this.setState({
      images: images
    });
  },

  // trigger the create action
  // TODO: pass in the rest of the state attributes needed
  submit(ev) {
    ev.preventDefault();
    // break out if this is disabled
    if(this.state.disabled) return;

    if(_.isEmpty(this.state.title) && _.isEmpty(this.state.images)) {
      this.refs.title.setErrorText('Please add text or images to your post.');
      return;
    }

    // send the create action
    PostActions.create(
      this.state.title, // title
      this.state.images, // image_url
      this.props.activeBoard // board
    );

    // reset fields
    this.setState({
      title: '',
      images: [],
      showEventModal: false,
      loading: true
    });
  },

  onTitleChange() {
    this.setState({ title: this.refs.title.getValue() });
  },

  renderBoardPicker() {
    let menuItems = [];
    if(this.props.activeBoard._id != undefined) {

    }

    return (
      <div className='board-picker'>
        <span className='posting-to'>
          Posting to
        </span>
      </div>
    );
  },

  renderPostButton() {
    if(this.state.loading) {
      return (
        <CircularProgress
          mode="indeterminate"
          color='#666'
          size={ 0.6 }
          style={{ marginRight: 20 }}
        />
      );
    } else {
      return (
        <button
          className='post-button'
          title='Post'
          onClick={ this.submit }
          style={{
            backgroundColor: (this.state.disabled) ? '#EEE' : 'transparent',
            cursor: (this.state.disabled) ? 'default' : 'pointer'
          }}
        >
          <Ink
            style={{ visibility: (this.state.disabled) ? 'hidden' : 'visible' }}
          />
          <span className='post-button-text'>
            Post
          </span>
        </button>
      );
    }
  },

  render() {
    var dropzoneOptions = {
      acceptedFiles: 'image/*',
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      dictDefaultMessage: 'Upload a Picture',
      addRemoveLinks: true,
      clickable: '#attach-picture'
    };

    var mediaTip = <Tooltip id='newpost-mediatip'>Attach Pictures</Tooltip>;
    if(_.isEmpty(window.bootstrap.user) || this.state.disabled) {
      mediaTip = <div/>;
    }

    return (
      <div
        className='new-post-panel'
        postId={ this.state.id }
      >
        <div className="new-post-title">
          <TextField
            className="title-field"
            hintText={ this.state.hintText }
            disabled={ this.state.disabled }
            ref='title'
            multiLine={ true }
            value={ this.state.title }
            onChange={ this.onTitleChange }
            style={{ width: '100%' }}
            underlineFocusStyle={{ borderColor: '#666' }}
          />
        </div>

        <Uploader
          onUploadComplete={ this.onUploadComplete }
          onRemovedFile={ this.onRemovedFile }
          dropzoneOptions={ dropzoneOptions }
          className="dropzone"
          tooltip='Attach Image'
        />

        <div className='panel-bottom'>
          <OverlayTrigger
            overlay={ mediaTip }
            placement='bottom'
          >
            <button
              className='attach-picture'
              title='Attach Media'
              id='attach-picture'
              onClick={ this.preventDefault }
              style={{
                backgroundColor: (this.state.disabled) ? '#EEE' : 'transparent',
                cursor: (this.state.disabled) ? 'default' : 'pointer'
              }}
            >
              <Ink
                style={{ visibility: (this.state.disabled) ? 'hidden' : 'visible' }}
              />
              <i className='material-icons'>insert_photo</i>
            </button>
          </OverlayTrigger>
          { this.renderPostButton() }
        </div>
      </div>
    );
  }
});

module.exports = NewPostPanel;
