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
var TimePicker = mui.TimePicker;

var Uploader = require('./../../shared/components/Uploader.jsx');

var PostActions = require('./../PostActions');

var user = window.bootstrap.user;

var CreateNewEventPanel = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      title: '',
      image: '/img/default_event_img.png',
      bevies: [],
      selectedIndex: 0,
      date: '',
      time: '',
      location: '',
      description: '',
      attendees: '',
      error: ''
    };
  },

  onUploadComplete(file) {
    this.setState({
      image: file,
    });
  },

  submit(ev) {
    ev.preventDefault();

    if(!this.state.title) 
      this.refs.title.setErrorText('a title is required');

    if(!this.state.location) 
      this.refs.location.setErrorText('a location is required');

    if(!this.state.title || !this.state.location) 
      return;

    var date = new Date(this.state.date);
    var time = new Date(this.state.time);
    var dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
               time.getHours(), time.getMinutes(), time.getSeconds());

    var description = this.state.description || '';

    event = {
        date: dateTime,
        location: this.state.location,
        description: description,
        attendees: []
      };

    console.log(event);

    // send the create action
    PostActions.create(
      this.state.title, // title
      [this.state.image], // image
      window.bootstrap.user, // author
      this.props.activeBevy, // bevy
      'event', //type
      event // event
    );

    // reset fields
    this.setState(this.getInitialState());
  },

  handleChange() {
    this.setState({
      title: this.refs.title.getValue(),
      description: this.refs.description.getValue(),
      location: this.refs.location.getValue(),
      date: this.refs.date.getDate(),
      time: this.refs.time.getTime()
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

    var now = new Date(Date.now());
    var max = new Date(2050, 1, 1);

    return (
      <div className="create-event" >
          <div className='title'>Create a new Event</Modal.Title>
        <div className="bevy-info">
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
              minDate={now}
              maxDate={max}
              onChange={ this.handleChange }
              defaultDate={now}
              style={{top: '-50px', paddingTop: '0px', marginTop: '-50px'}}
              textFieldStyle={{marginTop: '50px'}}
            />
            <TimePicker
              ref='time'
              format="ampm"
              hintText="time" 
              onChange={ this.handleChange }
            />
          </div>
        </div>
        <div className="panel-bottom">
          <FlatButton
            onClick={ this.props.onHide }
            label="Cancel"
            style={{marginRight: '10px'}}
          />
          <RaisedButton
            onClick={ this.submit }
            label="Create"
          />
        </div>
      </div>
    );
  }
});

module.exports = CreateNewEventPanel;
