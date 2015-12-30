/**
 * NewPostPanel.jsx
 *
 * The dialog for creating a post
 *
 * @author kevin
 */

'use strict';

// imports
var React = require('react');
var _ = require('underscore');
var Ink = require('react-ink');

var classNames = require('classnames');

var constants = require('./../../constants');

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
  RaisedButton
} = require('material-ui');

var Uploader = require('./../../shared/components/Uploader.jsx');
var CreateNewEventModal = require('./CreateNewEventModal.jsx');

var PostActions = require('./../PostActions');

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
var hintText = hintTexts[Math.floor(Math.random() * hintTexts.length)];

var user = window.bootstrap.user;

// React class
var NewPostPanel = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object.isRequired,
    myBevies: React.PropTypes.array.isRequired,
    activeBoard: React.PropTypes.object.isRequired
  },

  // start with an empty title
  // TODO: when the dialog is expanded, add the default options here
  getInitialState() {
    return {
      title: '',
      images: [],
      showEventModal: false
    };
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
      window.bootstrap.user, // author
      this.props.activeBoard, // board
      undefined,
      undefined
    );

    // reset fields
    this.setState({
      title: '',
      images: [],
      showEventModal: false
    });
  },

  // triggered every time a key is pressed
  // updates the state
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

    if(this.props.activeBoard.type == 'announcement' && !_.contains(board.admins, window.bootstrap.user)) {
      return <div/>;
    }

    if(this.props.activeBoard.type == 'event') {
      return <div/>;
    }

    var mediaTip = <Tooltip>attach pictures</Tooltip>;
    //var eventTip = <Tooltip>create an event</Tooltip>;
    if(_.isEmpty(window.bootstrap.user)) {
      mediaTip = <div/>;
      //eventTip = <div/>;
    }

    return (
      <Panel className="panel new-post-panel" postId={ this.state.id }>
        <div className="new-post-title">
          <TextField
            className="title-field"
            hintText={ hintText }
            ref='title'
            multiLine={ true }
            value={ this.state.title }
            onChange={ this.handleChange }
            disabled={ disabled }
            style={{ width: '100%' }}
          />
        </div>

        <Uploader
          onUploadComplete={ this.onUploadComplete }
          onRemovedFile={ this.onRemovedFile }
          dropzoneOptions={ dropzoneOptions }
          className="dropzone"
        />

        <div className="panel-bottom">
          <div className='paperclip action'>
            <OverlayTrigger overlay={mediaTip} placement='bottom'>
              <FloatingActionButton
                title="Attach Media"
                iconClassName="glyphicon glyphicon-picture"
                className='attach-picture'
                onClick={ this.preventDefault }
                disabled={ disabled }
                backgroundColor={'white'}
                disabledColor={'rgba(0,0,0,.2)'}
                iconStyle={{color: 'rgba(0,0,0,.6)', fontSize: '18px'}}
                style={{marginRight: '15px'}}
                mini={true}
              />
            </OverlayTrigger>
            {/*<OverlayTrigger overlay={eventTip} placement='bottom'>
              <FloatingActionButton
                title="New Event"
                iconClassName="glyphicon glyphicon-calendar"
                onClick={() => { this.setState({ showEventModal: true }); }}
                disabled={ disabled }
                backgroundColor={'white'}
                disabledColor={'rgba(0,0,0,.2)'}
                iconStyle={{color: 'rgba(0,0,0,.6)', fontSize: '18px'}}
                mini={true}
              />
            </OverlayTrigger>*/}
            {/*<CreateNewEventModal
              show={ this.state.showEventModal }
              onHide={() => { this.setState({ showEventModal: false }); }}
              {...this.props}
            />*/}
          </div>
          {/*<Badge className='tag-indicator' style={{backgroundColor: tagColor, position: 'absolute', marginLeft: '5px', marginTop: '13px'}}>{tagName}</Badge>*/}
          {/* tagDropdown */}
          <RaisedButton
            label="post"
            onClick={this.submit}
            disabled={ disabled }
          />
        </div>
      </Panel>
    );
  }
});

module.exports = NewPostPanel;
