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
];
var hintText = hintTexts[Math.floor(Math.random() * hintTexts.length)];

var user = window.bootstrap.user;

// React class
var NewPostPanel = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object.isRequired,
    myBevies: React.PropTypes.array.isRequired,
    disabled: React.PropTypes.bool
  },

  // start with an empty title
  // TODO: when the dialog is expanded, add the default options here
  getInitialState() {
    return {
      title: '',
      images: [],
      selectedIndex: 0,
      disabled: this.props.disabled,
      showEventModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
  },

  onUploadComplete(file) {
    var filename = file.filename;
    var image_url = constants.apiurl + '/files/' + filename;
    var images = this.state.images;
    images.push(image_url);
    this.setState({
      images: images
    });
  },

  onRemovedFile(file) {
    var filename = JSON.parse(file.xhr.response).filename;
    //console.log(filename);
    var image_url = constants.apiurl + '/files/' + filename;
    var images = this.state.images;
    images = _.reject(images, function($image_url){ return $image_url == image_url });
    //console.log(images);
    this.setState({
      images: images
    });
  },

  // trigger the create action
  // TODO: pass in the rest of the state attributes needed
  submit(ev) {
    ev.preventDefault();

    if(_.isEmpty(this.state.title) && _.isEmpty(this.state.images)) {
      return;
    }

    var tag = this.props.activeBevy.tags[this.state.selectedIndex];

    //console.log(tag);

    // send the create action
    PostActions.create(
      this.state.title, // title
      this.state.images, // image_url
      window.bootstrap.user, // author
      this.props.activeBevy, // bevy
      undefined,
      undefined,
      tag
    );

    // reset fields
    this.setState(this.getInitialState());
  },

  // triggered every time a key is pressed
  // updates the state
  handleChange() {
    this.setState({
      title: this.refs.title.getValue()
    });
  },

  onTagChange(e, selectedIndex, menuItem) {
    this.setState({
      selectedIndex: selectedIndex
    });
  },

  setIndex(key) {
    this.setState({
      selectedIndex: key
    });
  },

  render() {

    var dropzoneOptions = {
      acceptedFiles: 'image/*',
      thumbnailWidth: 500,
      thumbnailHeight: 500,
      dictDefaultMessage: 'Upload a Picture',
      addRemoveLinks: true,
      clickable: '.attach-picture'
    };

    var tags = (this.props.activeBevy) ? this.props.activeBevy.tags : [];
    var tagColor = this.props.activeBevy.tags[this.state.selectedIndex].color;
    var tagName = this.props.activeBevy.tags[this.state.selectedIndex].name;

    var tagItems = [];

    if(this.props.activeBevy) {
      for(var key in tags) {
        var tag = tags[key];
        tagItems.push(
        <MenuItem eventKey={ key } key={ 'newpostpanel:tag:' + key } onSelect={this.setIndex}>
          <span className='color-dot' style={{backgroundColor: tag.color, padding: '1px 9px'}}/>
            {tag.name}
        </MenuItem>
        );
      }
    }

    /*
      <DropDownMenu
        className='bevies-dropdown'
        autoWidth={false}
        menuItems={tagItems}
        selectedIndex={ selectedIndex }
        onChange={ this.onTagChange }
        underlineStyle={{borderColor: tagColor, borderTopWidth: '2px'}}
      />
    */

    var selectedIndex = this.state.selectedIndex;

    var tagDropdown = (this.state.activeBevy)
    ? <div/>
    : (
    <DropdownButton style={{backgroundColor: tags[this.state.selectedIndex].color}} title={tags[this.state.selectedIndex].name} id='bg-nested-dropdown'>
      {tagItems}
    </DropdownButton>
    );

    var disabled = this.props.disabled;

    hintText = (disabled)
    ? 'you must be logged in to post'
    : hintText

    if(this.props.activeBevy.admin_only) {
      disabled = true;
      hintText = 'only admins may post in this bevy';
    }

    var mediaTip = <Tooltip>attach pictures</Tooltip>;
    var eventTip = <Tooltip>create an event</Tooltip>;

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
            style={{width: '92%', marginLeft: '20px'}}
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
                style={{marginRight: '10px'}}
                mini={true}
              />
            </OverlayTrigger>
            <OverlayTrigger overlay={eventTip} placement='bottom'>
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
            </OverlayTrigger>
            <CreateNewEventModal
              show={ this.state.showEventModal }
              onHide={() => { this.setState({ showEventModal: false }); }}
              {...this.props}
            />
          </div>
          {/*<Badge className='tag-indicator' style={{backgroundColor: tagColor, position: 'absolute', marginLeft: '5px', marginTop: '13px'}}>{tagName}</Badge>*/}
          { tagDropdown }
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
