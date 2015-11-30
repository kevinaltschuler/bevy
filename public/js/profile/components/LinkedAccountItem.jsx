/**
 * LinkedAccountItem.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var {
  Button,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');

var _ = require('underscore');
var UserActions = require('./../UserActions');
var constants = require('./../../constants');

var LinkedAccountItem = React.createClass({
  propTypes: {
    account: React.PropTypes.object
  },

  switchUser() {
    UserActions.switchUser(this.props.account._id);
  },

  unlink() {
    if(confirm('Are you sure you want to unlink this account?')) {
      UserActions.unlinkAccount(this.props.account);
    }
  },

  render() {
    var account = this.props.account;
    var image_url = (_.isEmpty(account.image)) 
      ? constants.defaultProfileImage 
      : account.image.filename;
    return (
      <div className='linked-account'>
        <a 
          href='#' 
          title={ 'Switch Account to ' + account.displayName } 
          className='switch-btn' 
          onClick={ this.switchUser }
        >
          <div 
            className='image' 
            style={{ backgroundImage: 'url(' + image_url + ')' }}
          />
          <span className='display-name'>
            { account.displayName }
          </span>
        </a>
        <OverlayTrigger placement='left' overlay={ 
          <Tooltip>Unlink Account</Tooltip> 
        }>
          <Button className='unlink-btn' onClick={ this.unlink }>
            <span className='glyphicon glyphicon-remove' />
          </Button>
        </OverlayTrigger>
      </div>
    );
  }
});

module.exports = LinkedAccountItem;