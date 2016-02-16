/**
 * AdminModal.jsx
 * @author albert
 * @flow
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
var UserItem = require('./../../user/components/UserItem.jsx');

var _ = require('underscore');
var constants = require('./../../constants');

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

  hide() {
    this.props.onHide();
  },

  _renderAdmins() {
    var admins = this.state.admins;
    var adminItems = [];
    for(var key in admins) {
      var admin = admins[key];
      adminItems.push(
        <UserItem
          key={ 'adminitem:' + admin._id }
          user={ admin }
          linkAction='startPM'
        />
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
