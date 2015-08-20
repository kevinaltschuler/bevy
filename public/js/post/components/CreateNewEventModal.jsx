/**
 * CreateNewEvent.jsx
 *
 * i cant believe im rewriting this rn.
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');
var constants = require('./../../constants');

var rbs = require('react-bootstrap');
var Modal = rbs.Modal;

var DateTimeField = require('react-bootstrap-datetimepicker');

var mui = require('material-ui');
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;
var DatePicker = mui.DatePicker;

var Uploader = require('./../../shared/components/Uploader.jsx');

var PostActions = require('./../PostActions');

var user = window.bootstrap.user;

var CreateNewEventModal = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object.isRequired,
    myBevies: React.PropTypes.array.isRequired,
    disabled: React.PropTypes.bool,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      title: '',
      image: '/img/default_event_img.png',
      bevies: [],
      selectedIndex: 0,
      date: '',
      location: '',
      description: '',
      attendees: '',
      error: ''
    };
  },

  onUploadComplete(file) {
    var filename = file.filename;
    var image = constants.apiurl + '/files/' + filename
    this.setState({
      image: image,
    });
  },

  submit(ev) {
    ev.preventDefault();

    if(!(this.state.date && this.state.location && this.state.title)) {
      this.setState({
        error: 'please complete all required fields'
      });
      return;
    }
    
    event = {
        date: this.state.date,
        location: this.state.location,
        description: this.state.description,
        attendees: null
      };

    console.log(event);

    // send the create action
    PostActions.create(
      this.state.title, // title
      [this.state.image], // image_url
      window.bootstrap.user, // author
      this.props.activeBevy, // bevy
      'event', //type
      event // event
    );

    // reset fields
    this.setState(this.getInitialState());
    this.props.onHide(); 
  },

  handleChange() {
    this.setState({
      title: this.refs.title.getValue(),
      description: this.refs.description.getValue(),
      location: this.refs.location.getValue()
    });
  },

  handleDate(x) {
    this.setState({
      date: x     
    });
  },

  render() {

    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.dropzone-panel-button',
      dictDefaultMessage: ' ',
    };
    var eventImageStyle = {
      backgroundImage: 'url(' + this.state.image + ')',
      backgroundSize: '100% auto'

    };
    var error = this.state.error;
    var errorStyle = (error = '') ? {display: 'none'} : {marginTop: '10px', color: 'red'};

    return (
      <Modal className="create-bevy create-event" show={ this.props.show } onHide={ this.props.onHide } >
        <Modal.Header closeButton>
          <Modal.Title>Create a new Event</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bevy-info">
          <div className="new-bevy-picture">
            <Uploader
              onUploadComplete={ this.onUploadComplete }
              className="bevy-image-dropzone"
              style={ eventImageStyle }
              dropzoneOptions={ dropzoneOptions }
            />
          </div>
          <div className='error' style={errorStyle}>{error}</div>
          <div className='text-fields'>
            <TextField
              className="title-field"
              hintText='event title'
              ref='title'
              value={ this.state.title }
              onChange={ this.handleChange }
            />
            <TextField
              className="title-field"
              hintText='event description'
              ref='description'
              multiLine={ true }
              value={ this.state.description }
              onChange={ this.handleChange }
            />
            <TextField
              className="title-field"
              hintText='location'
              ref='location'
              value={ this.state.location }
              onChange={ this.handleChange }
            />
            <DatePicker 
              ref='date'
              hintText='date'
              minDate={Date.now}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="panel-bottom">
          <FlatButton
            onClick={ this.props.onHide }
            label="Cancel"
            style={{marginRight: '10px'}}
          />
          <RaisedButton
            onClick={ this.submit }
            label="Create"
          />
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = CreateNewEventModal;
