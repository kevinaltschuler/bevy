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
  Panel,
  Badge,
  Button,
  DropdownButton,
  MenuItem,
  Tooltip,
  OverlayTrigger
} = require('react-bootstrap');
var {
  TextField,
  DropDownMenu,
  FloatingActionButton,
  RaisedButton,
  CircularProgress
} = require('material-ui');
var Ink = require('react-ink');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var PostActions = require('./../PostActions');
var PostStore = require('./../PostStore');
var POST = constants.POST;

var hintTexts = [
  "What's on your mind?",
  "What's up?",
  "How's it going?",
  "What's new?",
  "How are you doing today?",
  "Share your thoughts",
  "Drop some knowledge buddy",
  "Drop a line",
  "What's good?",
  "What do you have to say?",
  "Spit a verse",
  "What would your mother think?",
  "Tell me about yourself",
  "What are you thinking about?",
  "Gimme a bar",
  "Lets talk about our feelings",
  "Tell me how you really feel",
  "How was last night?",
  "What's gucci?",
  "Anything worth sharing?",
];

var user = window.bootstrap.user;

var NewPostPanel = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object.isRequired,
    activeBoard: React.PropTypes.object.isRequired
  },

  getInitialState() {
    var disabled = false;
    var hintText = hintTexts[Math.floor(Math.random() * hintTexts.length)];
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
    this.setState({
      loading: false
    });
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

  handleChange() {
    this.setState({
      title: this.refs.title.getValue()
    });
  },

  render() {
    var board = this.props.activeBoard;

    var dropzoneOptions = {
      acceptedFiles: 'image/*',
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      dictDefaultMessage: 'Upload a Picture',
      addRemoveLinks: true,
      clickable: '.attach-picture'
    };

    if(this.props.activeBoard.type == 'event') {
      return <div/>;
    }

    var mediaTip = <Tooltip id='newpost-mediatip'>Attach Pictures</Tooltip>;
    //var eventTip = <Tooltip>create an event</Tooltip>;
    if(_.isEmpty(window.bootstrap.user) || this.state.disabled) {
      mediaTip = <div/>;
      //eventTip = <div/>;
    }

    var buttonOrLoading = (this.state.loading)
    ?  <CircularProgress mode="indeterminate" color='#666' size={.6} style={{marginRight: 20}}/>
    : <RaisedButton
            label="post"
            onClick={ this.submit }
            disabled={ this.state.disabled || this.state.loading}
          />;

    return (
      <Panel className="panel new-post-panel" postId={ this.state.id }>
        <div className="new-post-title">
          <TextField
            className="title-field"
            hintText={ this.state.hintText }
            disabled={ this.state.disabled }
            ref='title'
            multiLine={ true }
            value={ this.state.title }
            onChange={ this.handleChange }
            style={{ width: '100%' }}
            underlineFocusStyle={{borderColor: '#666'}}
          />
        </div>

        <Uploader
          onUploadComplete={ this.onUploadComplete }
          onRemovedFile={ this.onRemovedFile }
          dropzoneOptions={ dropzoneOptions }
          className="dropzone"
          tooltip='Attach Image'
        />

        <div className="panel-bottom">
          <div className='paperclip action'>
            <OverlayTrigger overlay={ mediaTip } placement='bottom'>
              <FloatingActionButton
                title="Attach Media"
                iconClassName="glyphicon glyphicon-picture"
                className='attach-picture'
                onClick={ this.preventDefault }
                backgroundColor={'white'}
                disabled={ this.state.disabled }
                disabledColor={ 'rgba(0,0,0,.2)' }
                iconStyle={{ color: 'rgba(0,0,0,.6)', fontSize: '18px' }}
                style={{ marginRight: '15px' }}
                mini={ true }
              />
            </OverlayTrigger>
          </div>
          {buttonOrLoading}
        </div>
      </Panel>
    );
  }
});

module.exports = NewPostPanel;
