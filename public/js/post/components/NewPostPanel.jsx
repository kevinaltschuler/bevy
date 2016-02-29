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
  OverlayTrigger,
  Input
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
var resizeImage = require('./../../shared/helpers/resizeImage');
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
    var disabled = false;
    var hintText = constants.hintTexts[Math.floor(Math.random() * constants.hintTexts.length)];
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

  componentWillReceiveProps(nextProps) {
    var disabled = false;
    var hintText = this.state.hintText;
    if(nextProps.activeBoard.type == 'announcement'
      && _.findWhere(nextProps.activeBoard.admins,
        { _id: window.bootstrap.user._id }) == undefined) {
      disabled = true;
      hintText = 'Only admins can post in an announcement board';
    } else {
      hintText = constants.hintTexts[Math.floor(Math.random() * constants.hintTexts.length)];
    }
    this.setState({
      disabled: disabled,
      hintText: hintText
    });
  },


  componentDidMount() {
    PostStore.on(POST.POSTED_POST, this.onPostSuccess);
  },

  onPostSuccess() {
    this.setState({
      loading: false,
      disabled: false
    });
  },

  onUploadComplete(file) {
    var images = this.state.images;
    images.push(file);
    this.setState({ images: images });
  },

  onRemovedFile(file) {
    var filename = JSON.parse(file.xhr.response).filename;
    var images = this.state.images;
    images = _.reject(images, function($image) {
      return $image.filename == filename;
    });
    this.setState({ images: images });
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
      loading: true,
      disabled: true
    });
    this.refs.title.innerHTML = '';
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

  renderArrowOrLoading() {
    if(this.state.loading) {
      return (
        <div className='loading-container'>
          <CircularProgress
            mode="indeterminate"
            color='#666'
            size={ 0.2 }
            style={{
              width: 20,
              height: 20
            }}
          />
        </div>
      );
    } else {
      return (
        <i className='material-icons'>send</i>
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
          <div
            className='profile-picture'
            title={ 'Posting as ' + window.bootstrap.user.displayName }
            style={{
              backgroundImage: 'url(' + resizeImage(window.bootstrap.user.image, 128, 128).url + ')'
            }}
          />
          <span
            className='hint-text'
            style={{
              visibility: (this.state.title.length > 0) ? 'hidden' : 'visible'
            }}
          >
            { this.state.hintText }
          </span>
          <div
            ref='title'
            className='input'
            contentEditable={ true }
            onInput={() => {
              // dont let the user type if this is disabled
              if(this.state.disabled) {
                this.refs.title.innerHTML = '';
                return;
              }
              // collect the inner html of the editable div
              var title = this.refs.title.innerHTML;

              // jenk way of stripping html elements
              var tmp = document.createElement("DIV");
              tmp.innerHTML = title;
              title = tmp.textContent || tmp.innerText || '';

              this.refs.title.innerHTML = title;
              this.setState({ title: title });
            }}
          >
          </div>
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
            placement='right'
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
            { this.renderArrowOrLoading() }
          </button>
        </div>
      </div>
    );
  }
});

module.exports = NewPostPanel;
