/**
 * AdminModal.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var {
  Modal,
  Button
} = require('react-bootstrap');
var {
  FlatButton
} = require('material-ui');

var _ = require('underscore');
var ChatActions = require('./../../chat/ChatActions');

var AdminModal = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {

    };
  },

  startPM(id) {
    if(!_.isEmpty(window.bootstrap.user))
      if(!(id == window.bootstrap.user._id))
        ChatActions.startPM(id);
  },

  hide() {
    this.props.onHide();
  },

  _renderAdmins() {
    var admins = this.props.activeBevy.admins;
    var adminItems = [];
    for(var key in admins) {
      var admin = admins[key];
      var image_url = (_.isEmpty(admin.image_url)) ? '/img/user-profile-icon.png' : admin.image_url;
      adminItems.push(
        <div key={ 'adminitem:' + key } className='admin-item' onClick={() => this.startPM(admin._id)}>
          <div className='img' style={{
            backgroundImage: 'url(' + image_url + ')'
          }} />
          <span className='name'>{ admin.displayName }</span>
        </div>
      );
    }
    return adminItems;
  },

  render() {
    return (
      <Modal show={ this.props.show } onHide={ this.hide } className='admin-modal'>
        <Modal.Header closeButton>
          <Modal.Title>Administrators of { this.props.activeBevy.name }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this._renderAdmins() }
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = AdminModal;