'use strict';

var React = require('react');
var _ = require('underscore');

var rbs = require('react-bootstrap');
var Button = rbs.Button;
var Input = rbs.Input;

var mui = require('material-ui');
var TextField = mui.TextField;
var Styles = mui.Styles;
var ThemeManager = new Styles.ThemeManager();

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

  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setComponentThemes({
      textField: {
        textColor: 'rgba(0,0,0,.9)',
        focusColor: 'rgba(0,0,0,.4)'
      }
    });
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

  onEnter(ev) {
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
  },

  handleToggle(ev) {
    ev.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen
    });
    document.getElementById('chat-panel').style.height = (this.state.isOpen) ? '30px' : '320px';
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

    var backgroundStyle = (bevy && !_.isEmpty(bevy.image_url))
    ? {
      backgroundImage: 'url(' + bevy.image_url + ')',
      opacity: 0.6
    }
    : {};

    var otherUser = {};
    if(!bevy && thread.users.length > 1) {
      otherUser = _.find(thread.users, function($user) {
        return $user._id != user._id;
      });
    }

    var name = (bevy) ? bevy.name : otherUser.displayName;

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

    var input = (this.state.isOpen)
    ?  <div className='chat-panel-input'>
        <div className='chat-text-field'>
          <TextField
            style={{marginLeft: '10px'}}
            type='text'
            ref='body'
            hintText='Chat'
            onEnterKeyDown={ this.onEnter }
            onChange={ this.onChange }
            value={ this.state.body }
          />
        </div>
      </div>
    : <div />;

    var body = (this.state.isOpen)
    ?  <div className='chat-panel-body'>
        <MessageList
          thread={ thread }
          messages={ this.state.messages }
          bevy={ bevy }
        />
        { input }
      </div>
    : <div />;

    return (
      <div className='chat-panel' id='chat-panel'>
        { header }
        { body }
      </div>
    );
  }
});

ChatPanel.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = ChatPanel;
