/**
 * ResetPage.jsx
 *
 * @author albert
 */

'use strict';

var React = require('react');
var {
  Input,
  Panel
} = require('react-bootstrap');
var {
  RaisedButton,
  TextField
} = require('material-ui');

var _ = require('underscore');
var constants = require('./../../constants');

var ResetPage = React.createClass({

  getInitialState() {
    return {
      statusText: '',
      passBsStyle: '',
      confirmPassBsStyle: ''
    };
  },

  onChange() {
    var pass = this.refs.pass.getValue();
    var confirmPass = this.refs.pass.getValue();

    if(!_.isEmpty(pass) && pass == confirmPass) {
      this.setState({
        passBsStyle: 'success',
        confirmPassBsStyle: 'success'
      });
    } else if(!_.isEmpty(pass) && pass != confirmPass) {
      this.setState({
        confirmPassBsStyle: 'success'
      });
    }
  },

  submit(ev) {
    ev.preventDefault();

    var pass = this.refs.pass.getValue();
    var confirmPass = this.refs.confirmPass.getValue();

    if(_.isEmpty(pass)) {
      this.setState({
        statusText: 'Please enter a password',
        passBsStyle: 'error'
      });
      return;
    }

    if(pass != confirmPass) {
      this.setState({
        statusText: 'Passwords do not match',
        confirmPassBsStyle: 'error'
      });
      return;
    }

    var router = require('./../../router');
    var reset_token = router.reset_token;
    fetch(constants.siteurl + '/reset/' + reset_token, {
      method: 'POST',
      body: JSON.stringify({
        password: pass
      })
    })
    .then(res => {
      console.log(res);
      // redirect to home?
      //window.location.href = constants.siteurl + '/login';
    });
  },

  render() {
    var status = <div />;
    if(!_.isEmpty(this.state.statusText)) {
      status = (
        <div className='error'>
          <span>{ this.state.statusText }</span>
        </div>
      );
    }

    return (
      <div className='reset-container'>
        <div className='title-header'>
          <a title='Home' href={ constants.siteurl }>
            <img src='/img/logo_200.png' height="60" width="60"/>
          </a>
          <h1>Bevy</h1>
        </div>
        <div className='reset-header'>
          <h2>Reset Password</h2>
        </div>

        <Panel className="reset-panel">
          { status }
          <TextField
            type='password'
            name='pass'
            ref='pass'
            placeholder='New Password'
            style={{ width: '100%', margin: '0px 0px' }}
            onChange={ this.onChange }
          />
          <TextField
            type='password'
            name='confirmPass'
            ref='confirmPass'
            placeholder='Confirm Password'
            style={{ width: '100%', marginBottom: 10 }}
            onChange={ this.onChange }
          />
          <RaisedButton
            className='reset-submit'
            label='Submit'
            backgroundColor='#2cb673'
            labelColor='white'
            fullWidth={ true }
            onClick={ this.submit }
          />
        </Panel>
        <a title='Login' href='/login'>Back to Login</a>
      </div>
    );
  }
});
module.exports = ResetPage;
