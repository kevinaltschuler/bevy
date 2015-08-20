'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var Input = rbs.Input;

var MessageList = require('./MessageList.jsx');

var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');
var BevyStore = require('./../../bevy/BevyStore');

var constants = require('./../../constants');
var CHAT = constants.CHAT;

var user = window.bootstrap.user;

var ChatPanel = React.createClass({

  propTypes: {
    thread: React.PropTypes.object
  },

  getInitialState() {
    return {
      isOpen: true,
      body: '',
      messages: ChatStore.getMessages(this.props.thread._id)
    };
  },

  componentDidMount() {
    ChatStore.on(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
    ChatStore.on(CHAT.PANEL_TOGGLE + this.props.thread._id, this._onPanelToggle);
  },

  componentWillUnmount() {
    ChatStore.off(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
    ChatStore.off(CHAT.PANEL_TOGGLE + this.props.thread._id, this._onPanelToggle);
  },

  _onMessageFetch() {
    this.setState({
      messages: ChatStore.getMessages(this.props.thread._id)
    });
  },

  _onPanelToggle() {
    this.setState({
      isOpen: true
    });
  },

  onChange(ev) {
    var body = this.refs.body.getValue();
    this.setState({
      body: body
    });
  },

  onKeyPress(ev) {
    if(ev.which == 13) {

      // dont send empty messages
      if(_.isEmpty(this.state.body)) return;

      // create message
      var thread = this.props.thread;
      var author = window.bootstrap.user;
      var body = this.refs.body.getValue();
      ChatActions.createMessage(thread._id, author, body);

      // reset input field
      this.setState({
        body: ''
      });
    }
  },

  handleToggle(ev) {
    ev.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen
    });
  },

  closePanel(ev) {
    ev.preventDefault();
    ChatActions.closePanel(this.props.thread._id);
  },

  render() {

    var thread = this.props.thread;
    var bevy = thread.bevy;

    var expandGlyph = (this.state.isOpen) ? 'glyphicon-minus' : 'glyphicon-plus';
    var expandTitle = (this.state.isOpen) ? 'Minimize' : 'Maximize';

    

    var name = ChatStore.getThreadName(thread._id);
    var image_url = ChatStore.getThreadImageURL(thread._id);
    var backgroundStyle = ((bevy && !_.isEmpty(bevy.image_url)) || (!_.isEmpty(thread.image_url)))
    ? {
      backgroundImage: 'url(' + image_url + ')',
      opacity: 0.6
    }
    : {};

    var header = (
      <div className='chat-panel-header'>
        <div className='chat-panel-background-wrapper' style={{ color: '#000' }}>
          <div className='chat-panel-background-image' style={ backgroundStyle } />
        </div>
        <div className='chat-panel-head'>
          <a href='#' className='bevy-name' title={ expandTitle } onClick={ this.handleToggle }>
            { name }
          </a>
          <div className='actions'>
            {/*<span className={ 'glyphicon ' + expandGlyph + ' btn' } title={ expandTitle } onClick={ this.handleToggle }></span>*/}
            <span className="glyphicon glyphicon-remove btn" title='Close' onClick={ this.closePanel }></span>
          </div>
        </div>
      </div>
    );

    var input = (
      <div className='chat-panel-input'>
        <div className='chat-text-field'>
          <Input
            type='text'
            ref='body'
            placeholder='Chat'
            onKeyPress={ this.onKeyPress }
            onChange={ this.onChange }
            value={ this.state.body }
          />
        </div>
      </div>
    );
    if(!this.state.isOpen) input = <div />;

    var body = (
      <div className='chat-panel-body'>
        <MessageList
          thread={ thread }
          messages={ this.state.messages }
          bevy={ bevy }
        />
        { input }
      </div>
    );
    if(!this.state.isOpen) body = <div />;

    return (
      <div className='chat-panel'>
        { header }
        { body }
      </div>
    );
  }
});

module.exports = ChatPanel;
