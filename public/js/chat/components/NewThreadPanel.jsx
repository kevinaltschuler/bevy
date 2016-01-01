/**
 * NewThreadPanel.jsx
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var {
  Input,
  Button
} = require('react-bootstrap');
var UserSearchOverlay = require('./UserSearchOverlay.jsx');

var _ = require('underscore');
var ChatActions = require('./../ChatActions');

var NewThreadPanel = React.createClass({
  getInitialState() {
    return {
      inputValue: '',
      addedUsers: [],
      message: ''
    };
  },

  componentDidMount() {
    this.container = ReactDOM.findDOMNode(this.refs.Container);
  },

  close() {
    // close the panel
    ChatActions.closePanel('-1');
    // remove it from the threads list
    ChatActions.cancelNewMessage();
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
      if(addedUsers.length < 1) return; // dont do anything if there's no users added yet
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
    _.uniq(users); // remove duplicates
    users.push(user);
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

  onMessageKeyPress(ev) {
    if(ev.which == 13 && this.state.addedUsers.length > 0) {
      // enter button was pressed
      if(_.isEmpty(this.state.message)) return; // dont send empty message

      // create message and thread
      ChatActions.createThreadAndMessage(
        this.state.addedUsers, // users to add
        this.state.message // message body text
      );
    }
  },

  onMessageChange(ev) {
    var message = this.refs.MessageInput.getValue();
    this.setState({
      message: message
    });
  },

  _renderAddedUsers() {
    var itemArray = [];
    for(var key in this.state.addedUsers) {
      var addedUser = this.state.addedUsers[key];
      itemArray.push(
        <div className='added-user' key={ 'newthreadpanel:addeduser:' + addedUser._id }>
          <span className='display-name'>{ addedUser.displayName }</span>
          <Button id={ addedUser._id } className='remove-btn' onClick={ this.removeUser }>
            <span id={ addedUser._id } className='glyphicon glyphicon-remove'></span>
          </Button>
        </div>
      );
    }
    return itemArray;
  },

  _renderInput() {
    return (
      <div className='message-input-container' style={{ backgroundColor: '#eee' }}>
        <Input
          type='text'
          ref='MessageInput'
          placeholder='Chat'
          onKeyPress={ this.onMessageKeyPress }
          onChange={ this.onMessageChange }
          value={ this.state.message }
          groupClassName='message-input'
          disabled={ this.state.addedUsers.length <= 0}
        />
      </div>
    );
  },

  render() {
    return (
      <div ref='Container' className='new-thread-panel'>
        <div className='header'>
          <a href='#' className='title' title='Close' onClick={ this.close }>
            New Message
          </a>
          <div className='actions'>
            {/*<span className={ 'glyphicon ' + expandGlyph + ' btn' } title={ expandTitle } onClick={ this.handleToggle }></span>*/}
            <span className="glyphicon glyphicon-remove btn" title='Close' onClick={ this.close }></span>
          </div>
        </div>
        <div className='participants'>
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
        <UserSearchOverlay
          container={ this.container }
          target={() => ReactDOM.findDOMNode(this.refs.AddUserInput)}
          query={ this.state.inputValue }
          addUser={ this.addUser }
          addedUsers={ this.state.addedUsers }
        />
        { this._renderInput() }
      </div>
    );
  }
});

module.exports = NewThreadPanel;
