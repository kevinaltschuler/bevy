/**
 * ChatPanel.jsx
 * @author albert
 * @author kevin
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  Button,
  Input,
  DropdownButton,
  MenuItem,
  OverlayTrigger,
  Tooltip,
  Panel
} = require('react-bootstrap');
var {
  TextField,
  Styles,
} = require('material-ui');
var ThemeManager = new Styles.ThemeManager();
var MessageList = require('./MessageList.jsx');
var UserSearchOverlay = require('./UserSearchOverlay.jsx');
var EditParticipantsModal = require('./EditParticipantsModal.jsx');
var Uploader = require('./../../shared/components/Uploader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var CHAT = constants.CHAT;
var ChatActions = require('./../ChatActions');
var ChatStore = require('./../ChatStore');
var BevyStore = require('./../../bevy/BevyStore');
var user = window.bootstrap.user;

var ChatPanel = React.createClass({
  propTypes: {
    thread: React.PropTypes.object
  },

  getInitialState() {
    return {
      isOpen: true,
      body: '',
      messages: ChatStore.getMessages(this.props.thread._id),
      addedUsers: [],
      inputValue: '', // the value of the add user input
      showEditParticipantsModal: false,
      accordionType: 'add-user',
      image: this.props.thread.image,
      expanded: false
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
    console.log(CHAT.MESSAGE_FETCH + this.props.thread._id);
    ChatStore.on(CHAT.MESSAGE_FETCH + this.props.thread._id, this._onMessageFetch);
    ChatStore.on(CHAT.PANEL_TOGGLE + this.props.thread._id, this._onPanelToggle);

    this.container = ReactDOM.findDOMNode(this.refs.ChatPanelBody);
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
    document.getElementById('chat-panel:' + this.props.thread._id)
      .style.height = (this.state.isOpen)
        ? '30px'
        : '320px';
  },

  closePanel(ev) {
    ev.preventDefault();
    ChatActions.closePanel(this.props.thread._id);
  },

  onAddUserChange(ev) {
    ev.preventDefault();
    if(this.addUserTimeout != undefined) {
      clearTimeout(this.addUserTimeout);
      delete this.addUserTimeout;
    }
    this.addUserTimeout = setTimeout(() => {
      var value = this.refs.AddUserInput.getValue();
      this.setState({
        inputValue: value
      });
    }, 500);
  },

  onAddUserKeyDown(ev) {
    if(ev.which == 8 && _.isEmpty(this.state.inputValue)) {
      // backspace
      // delete the most recently added user
      var addedUsers = this.state.addedUsers;
      // dont do anything if there's no users added yet
      if(addedUsers.length < 1) return;
      addedUsers.pop();
      this.setState({
        addedUsers: addedUsers
      });
      // focus the text field
      this.refs.AddUserInput.getInputDOMNode().focus();
    }
  },

  addUser(user) {
    var users = _.map(this.state.addedUsers, function($user) {
      return $user;
    });
    users.push(user);
     // remove duplicates
    _.uniq(users);
    this.setState({
      addedUsers: users,
      inputValue: ''
    });
    // reset the text field
    this.refs.AddUserInput.getInputDOMNode().value = '';
    // focus the text field
    this.refs.AddUserInput.getInputDOMNode().focus();
  },

  removeUser(ev) {
    ev.preventDefault();
    var id = ev.target.getAttribute('id');
    var users = _.reject(this.state.addedUsers, function($user) {
      return $user._id == id;
    });
    this.setState({
      addedUsers: users
    });
  },

  onUploadComplete(file) {
    this.setState({
      image: file
    });
    var thread_id = this.props.thread._id;
    ChatActions.updateImage(thread_id, file);
  },

  _renderAddedUsers() {
    var itemArray = [];
    for(var key in this.state.addedUsers) {
      var addedUser = this.state.addedUsers[key];
      itemArray.push(
        <div className='added-user' key={ 'newthreadpanel:addeduser:' + addedUser._id }>
          <span className='display-name'>
            { addedUser.displayName }
          </span>
          <Button
            id={ addedUser._id }
            title={ 'Remove ' + addedUser.displayName }
            className='remove-btn'
            onClick={ this.removeUser }
          >
            <span id={ addedUser._id } className='glyphicon glyphicon-remove' />
          </Button>
        </div>
      );
    }
    return itemArray;
  },

  _renderAddUsersButton() {
    if(this.props.thread.type == 'board' || !this.state.isOpen) return <div />;
    return (
      <OverlayTrigger placement='top' overlay={
        <Tooltip id='add-user-tooltip'>Add Users to Chat</Tooltip>
      }>
        <Button
          className='close-btn'
          title='Add Users to Chat'
          onClick={() => this.setState({ expanded: true, accordionType: 'add-user' }) }
        >
          <span className="glyphicon glyphicon-user" />
        </Button>
      </OverlayTrigger>
    );
  },

  _renderChatOptions() {
    if(!this.state.isOpen) return <div />;
    var button;
    var dropzoneOptions = {
      maxFiles: 1,
      acceptedFiles: 'image/*',
      clickable: '.chat-panel-dropzone-btn',
      dictDefaultMessage: ' ',
      init: function() {
        this.on("addedfile", function() {
          if (this.files[1]!=null){
            this.removeFile(this.files[0]);
          }
        });
      }
    };
    switch(this.props.thread.type) {
      case 'board':
        button = <div/>;
        break;
      case 'group':
        button = (
          <DropdownButton className='settings-btn-group' buttonClassName='settings-btn' title={ <span className='glyphicon glyphicon-cog' /> } noCaret>
            <MenuItem
              eventKey='0'
              onSelect={() => this.setState({ expanded: true, accordionType: 'add-user' })}
            >
              Add Users to Chat...
            </MenuItem>
            <MenuItem
              eventKey='1'
              onSelect={() => this.setState({ showEditParticipantsModal: true })}
            >
              Edit Participants
            </MenuItem>
            <MenuItem
              eventKey='2'
              onSelect={() => this.setState({ expanded: true, accordionType: 'edit-name' })}
            >
              Edit Conversation Name
            </MenuItem>
            <MenuItem
              eventKey='3'
              className='chat-panel-dropzone-btn'
            >
              Edit Conversation Picture
              <Uploader
                onUploadComplete={ this.onUploadComplete }
                className="chat-image-dropzone"
                style={{display: 'none'}}
                dropzoneOptions={ dropzoneOptions }
              />
            </MenuItem>
            <MenuItem divider />
            <MenuItem
              eventKey='4'
              onSelect={() => {
                if(confirm('Are You Sure?')) {
                  ChatActions.removeUser(this.props.thread._id, window.bootstrap.user._id);
                }
              }}
            >
              Leave Conversation
            </MenuItem>
            <MenuItem
              eventKey='5'
              onSelect={() => {
                if(confirm('Are You Sure?')) {
                  ChatActions.deleteThread(this.props.thread._id);
                }
              }}
            >
              Delete Conversation
            </MenuItem>
          </DropdownButton>
        );
        break;
      case 'pm':
        button = (
          <DropdownButton
            id='options-settings-dropdown'
            noCaret
            className='settings-btn-group'
            buttonClassName='settings-btn'
            title={ <span className='glyphicon glyphicon-cog' /> }
          >
            <MenuItem
              eventKey='0'
              onSelect={() => this.setState({ expanded: true, accordionType: 'add-user' })}
            >
              Add Users to Chat...
            </MenuItem>
            <MenuItem divider />
            <MenuItem
              eventKey='1'
              onSelect={() => {
                if(confirm('Are You Sure?')) {
                  ChatActions.deleteThread(this.props.thread._id);
                }
              }}
            >
              Delete Conversation
            </MenuItem>
          </DropdownButton>
        );
        break;
    }
    return (
      <OverlayTrigger placement='top' overlay={
        <Tooltip id='chat-options-tooltip'>Options</Tooltip>
      }>
        { button }
      </OverlayTrigger>
    );
  },

  _renderAccordion() {
    switch(this.state.accordionType) {
      case 'add-user':
        return (
          <div className='add-users-container'>
            <div className='add-users'>
              <span className='to-text'>To:</span>
              { this._renderAddedUsers() }
              <Input
                type='text'
                ref='AddUserInput'
                onKeyDown={ this.onAddUserKeyDown }
                onChange={ this.onAddUserChange }
                groupClassName='participant-input'
              />
            </div>
            <Button
              className='done-btn'
              title='Done'
              onClick={() => {
                this.setState({ expanded: false });
                // dont do anything if they havent added anybody yet
                if(_.isEmpty(this.state.addedUsers)) return;
                ChatActions.addUsers(this.props.thread._id, this.state.addedUsers);
              }}
            >
              Done
            </Button>
          </div>
        );
        break;
      case 'edit-name':
        return (
          <div className='edit-name'>
            <Input
              type='text'
              ref='EditNameInput'
              defaultValue={ this.props.thread.name }
              groupClassName='edit-name-input'
            />
            <Button
              className='done-btn'
              title='Done'
              onClick={() => {
                this.setState({ expanded: false });
                var new_name = this.refs.EditNameInput.getValue();
                if(_.isEmpty(new_name)) return; // dont do anything with no name
                ChatActions.editThread(this.props.thread._id, new_name);
              }}
            >
              Done
            </Button>
          </div>
        );
        break;
    }
  },

  render() {
    var thread = this.props.thread;
    var board = thread.board;

    var name = ChatStore.getThreadName(thread._id);
    var image_url = ChatStore.getThreadImageURL(thread._id);
    // only show a background for bevy chats or group chats WITH custom images
    var backgroundStyle = (!_.isEmpty(thread.board)
      || ( thread.type == 'group'
      && !_.isEmpty(thread.image) ))
    ? {
      backgroundImage: 'url(' + image_url + ')',
      opacity: 0.6
    } : {};

    if(!_.isEmpty(board)) {
      if(board.image.path == '/img/default_board_img.png'
      || board.image.path == 'http://bevy.dev/img/default_board_img.png') {
        backgroundStyle = {};
      }
    }

    var body = (this.state.isOpen) ? (
      <div ref='ChatPanelBody' className='chat-panel-body'>
        <Panel collapsible expanded={ this.state.expanded }>
          { this._renderAccordion() }
        </Panel>
        <UserSearchOverlay
          container={ this.container }
          target={() => ReactDOM.findDOMNode(this.refs.AddUserInput) }
          query={ this.state.inputValue }
          addUser={ this.addUser }
          addedUsers={ _.union(this.state.addedUsers, thread.users) }
        />
        <MessageList
          thread={ thread }
          messages={ this.state.messages }
          board={ board }
        />
        <div className='chat-panel-input'>
          <div className='chat-text-field'>
            <Input
              type='text'
              ref='body'
              placeholder='Chat'
              onKeyDown={ this.onEnter }
              onChange={ this.onChange }
              value={ this.state.body }
            />
          </div>
        </div>
      </div>
    ) : <div ref='ChatPanelBody' />;

    return (
      <div className='chat-panel' id={'chat-panel:' + thread._id}>
        <div className='chat-panel-header'>
          <div className='chat-panel-background-wrapper' style={{ color: '#000' }}>
            <div className='chat-panel-background-image' style={ backgroundStyle } />
          </div>
          <div className='chat-panel-head'>
            <a
              href='#'
              className='bevy-name'
              title={ (this.state.isOpen)
                ? 'Minimize'
                : 'Maximize' }
              onClick={ this.handleToggle }
            >
              { name }
            </a>
            <div className='actions'>
              { this._renderAddUsersButton() }
              { this._renderChatOptions() }
              <OverlayTrigger placement='top' overlay={
                <Tooltip id='close-tooltip'>Close</Tooltip>
              }>
                <Button
                  title='Close Chat Panel'
                  className='close-btn'
                  onClick={ this.closePanel }
                >
                  <span className="glyphicon glyphicon-remove" />
                </Button>
              </OverlayTrigger>
            </div>
          </div>
        </div>

        { body }

        <EditParticipantsModal
          thread={ this.props.thread }
          show={ this.state.showEditParticipantsModal }
          onHide={() => {
            this.setState({ showEditParticipantsModal: false });
          }}
        />
      </div>
    );
  }
});

ChatPanel.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = ChatPanel;
