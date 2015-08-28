/**
 * AddAccountModal.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var {
  Modal,
  Button
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
      verifiedUser: {}
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

  verifyUser() {
    var username = this.refs.Username.getValue();
    var password = this.refs.Password.getValue();

    if(_.isEmpty(username)) return this.setState({ errorText: 'Please enter a username' });
    if(_.isEmpty(password)) return this.setState({ errorText: 'Please enter a password' });

    $.ajax({
      method: 'post',
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

        this.setState({
          verifiedUser: $user
        });
      }.bind(this),
      error: function(error) {
        this.setState({
          errorText: error.responseJSON
        });
      }.bind(this)
    });
  },

  _renderVerifiedUser() {
    if(_.isEmpty(this.state.verifiedUser)) return <div />;
    return (
      <div className='verified-user'>
        <div className='image' style={{
          backgroundImage: 'url(' + (_.isEmpty(this.state.verifiedUser.image_url) ? constants.defaultProfileImage : this.state.verifiedUser.image_url) + ')'
        }}/>
        <div className='details'>
          { this.state.verifiedUser.displayName }
        </div>
        <FlatButton
          label='Cancel'
          onClick={() => this.setState({ verifiedUser: {} })}
        />
      </div>
    );
  },

  _renderVerifyDialog() {
    if(!_.isEmpty(this.state.verifiedUser)) return <div />;
    return (
      <div className='verify-dialog'>
        <TextField
          ref='Username'
          hintText='username'
        />
        <TextField
          ref='Password'
          hintText='password'
          type='password'
        />
        <FlatButton
          label='Link Account'
          onClick={ this.verifyUser }
        />
      </div>
    );
  },

  _renderLinkButton() {
    if(_.isEmpty(this.state.verifiedUser)) return <div />;
    return (
      <FlatButton
        label='Link Account'
        onClick={() => {
          UserActions.linkAccount(this.state.verifiedUser);
          this.hide();
        }}
      />
    );
  },

  render() {
    return (
      <Modal className='add-account-modal' show={ this.props.show } onHide={ this.hide } >
        <Modal.Header closeButton>
          <Modal.Title>Add Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='warning'>
            Linking accounts allows you to switch between them without having to re-enter a username and password each time.<br />
            Signing into any of the accounts you link to yours will also give that account quick access to your current account.<br />
            Your linked accounts will not be visible to other users on the site.<br />
            Please consider the security risks of doing so before you continue.
          </p>

          <span className='error'>{ this.state.errorText }</span>

          { this._renderVerifiedUser() }
          { this._renderVerifyDialog() }
          { this._renderLinkButton() }
        </Modal.Body>
        <Modal.Footer>
          <FlatButton
            onClick={ this.hide }
            label='Close'
            style={{marginRight: '0px', marginBottom: '0px'}} 
          />
        </Modal.Footer>
      </Modal>
    );
  }
});

AddAccountModal.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = AddAccountModal;