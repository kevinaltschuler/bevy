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
var constants = require('./../../constants');
var ChatActions = require('./../../chat/ChatActions');

var AdminModal = React.createClass({
  propTypes: {
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    activeBoard: React.PropTypes.object,
    activeBevy: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      activeBoard: {},
      activeBevy: {}
    };
  },

  getInitialState() {
    return {
      admins: [],
      groupName: '',
      loading: true
    };
  },

  componentWillReceiveProps(nextProps) {
    // this modal is being shown
    if(nextProps.show) {
      var url = (_.isEmpty(this.props.activeBoard))
        ? constants.apiurl + '/bevies/' + this.props.activeBevy._id
        : constants.apiurl + '/boards/' + this.props.activeBoard._id;
      fetch(url, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          admins: res.admins,
          groupName: res.name,
          loading: false
        });
      })
      .catch(err => {
        this.setState({
          error: err,
          loading: false
        });
      });
    }
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
    var admins = this.state.admins;
    var adminItems = [];
    for(var key in admins) {
      var admin = admins[key];
      var image_url = (_.isEmpty(admin.image))
        ? constants.defaultProfileImage
        : admin.image.path;
      adminItems.push(
        <div
          key={ 'adminitem:' + key }
          className='admin-item'
          onClick={() => this.startPM(admin._id)}
        >
          <div className='img' style={{
            backgroundImage: 'url(' + image_url + ')'
          }} />
          <span className='name'>
            { admin.displayName }
          </span>
        </div>
      );
    }
    return adminItems;
  },

  render() {
    return (
      <Modal show={ this.props.show } onHide={ this.hide } className='admin-modal'>
        <Modal.Header closeButton>
          <Modal.Title>
            Administrators of "{ this.state.groupName }"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this._renderAdmins() }
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = AdminModal;
