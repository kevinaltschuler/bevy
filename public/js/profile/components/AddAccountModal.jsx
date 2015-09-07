/**
 * AddAccountModal.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var {
  Modal,
  Button,
  OverlayTrigger,
  Popover
} = require('react-bootstrap');
var {
  FlatButton,
  TextField,
  Styles
} = require('material-ui');
var ThemeManager = new Styles.ThemeManager();

var _ = require('underscore');
var $ = require('jquery');
var constants = require('./../../constants');
var UserActions = require('./../UserActions');

var AddAccountModal = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    linkedAccounts: React.PropTypes.array
  },

  getInitialState() {
    return {
      errorText: '',
      validUsername: false
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
        textColor: 'black',
        focusColor: 'rgba(0,0,0,.40)'
      }
    });
  },

  hide() {
    this.setState({
      verifiedUser: {},
      errorText: ''
    });
    this.props.onHide();
  },

  onUsernameChange(ev) {
    ev.preventDefault();

    if(this.usernameTimeout != undefined) {
      clearTimeout(this.usernameTimeout);
      delete this.usernameTimeout;
    }
    this.usernameTimeout = setTimeout(this.verifyUsername, 500);
  },

  verifyUsername() {
    $.ajax({
      url: constants.apiurl + '/users/' + this.refs.Username.getValue() + '/verify',
      method: 'GET',
      success: function(data) {
        this.setState({
          validUsername: !data.found
        });
      }.bind(this),
      error: function(error) {
        console.log(error.responseJSON);
      }
    });
  },

  verifyUser() {
    var username = this.refs.Username.getValue();
    var password = this.refs.Password.getValue();

    if(_.isEmpty(username)) return this.setState({ errorText: 'Please enter a username' });
    if(_.isEmpty(password)) return this.setState({ errorText: 'Please enter a password' });
    if(username == window.bootstrap.user.username) return this.setState({ errorText: 'you cant link yourself ;)' });

    $.ajax({
      method: 'POST',
      url: constants.siteurl + '/verify',
      data: {
        username: username,
        password: password
      },
      success: function($user) {
        // check for duplicates
        if(_.find(this.props.linkedAccounts, function($account) {
          return $account._id == $user._id;
        }) != undefined) {
          // duplicate found
          return this.setState({
            errorText: 'Account already linked'
          });
        }

        UserActions.linkAccount($user);
        this.hide();
      }.bind(this),
      error: function(error) {
        this.setState({
          errorText: error.responseJSON
        });
      }.bind(this)
    });
  },

  createUser() {
    var username = this.refs.Username.getValue();
    var password = this.refs.Password.getValue();

    if(_.isEmpty(username)) return this.setState({ errorText: 'Please enter a username' });
    if(!this.state.validUsername) return this.setState({ errorText: 'Username already in use' });
    if(_.isEmpty(password)) return this.setState({ errorText: 'Please enter a password' });

    $.ajax({
      method: 'POST',
      url: constants.apiurl + '/users',
      data: {
        username: username,
        password: password
      },
      success: function($user) {
        UserActions.linkAccount($user);
        this.hide();
      }.bind(this),
      error: function(error) {
        this.setState({
          errorText: error.responseJSON
        });
      }.bind(this)
    });
  },

  _renderError() {
    if(_.isEmpty(this.state.errorText)) return <div />;
    return (
      <span className='error'>{ this.state.errorText }</span>
    );
  },

  _renderVerifyDialog() {
    return (
      <div className='verify-dialog'>
        <TextField
          ref='Username'
          hintText='username'
          type='text'
          onChange={ this.onUsernameChange }
        />
        <TextField
          ref='Password'
          hintText='password'
          type='password'
        />
        <div className='verify-buttons'>
          <FlatButton
            label='Link Account'
            onClick={ this.verifyUser }
          />
          <FlatButton
            label='Create Account'
            onClick={ this.createUser }
          />
        </div>
      </div>
    );
  },

  render() {
    return (
      <Modal className='add-account-modal' show={ this.props.show } onHide={ this.hide } >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className='title'>
              <span className='title-text'>Add Account</span>
              <OverlayTrigger placement='right' overlay={ 
                <Popover title='Link Account Help'>
                  <p className='warning'>
                    Linking accounts allows you to switch between them without having to re-enter a username and password each time.<br /><br />
                    Signing into any of the accounts you link to yours will also give that account quick access to your current account.<br /><br />
                    Your linked accounts will not be visible to other users on the site.<br /><br />
                    Please consider the security risks of doing so before you continue.
                  </p>
                </Popover> 
              }>
                <span className='glyphicon glyphicon-question-sign' />
              </OverlayTrigger>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this._renderError() }
          { this._renderVerifyDialog() }
        </Modal.Body>
      </Modal>
    );
  }
});

AddAccountModal.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = AddAccountModal;