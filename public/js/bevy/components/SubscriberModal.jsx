/**
 * SubscriberModal.jsx
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

var SubscriberModal = React.createClass({
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
      subs: [],
      groupName: '',
      loading: true
    };
  },

  componentWillReceiveProps(nextProps) {
    // this modal is being shown
    if(nextProps.show) {
      var url = (_.isEmpty(this.props.activeBoard))
        ? constants.apiurl + '/bevies/' + this.props.activeBevy._id + '/subscribers'
        : constants.apiurl + '/boards/' + this.props.activeBoard._id + '/subscribers';
      fetch(url, {
        method: 'GET'
      })
      .then(res => res.json())
      .then(res => {
        this.setState({
          subs: res,
          groupName: (_.isEmpty(this.props.activeBoard))
            ? this.props.activeBevy.name
            : this.props.activeBoard.name,
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

  startPM(id) {
  },

  _renderSubs() {
    var subs = this.state.subs;
    var subItems = [];
    for(var key in subs) {
      var sub = subs[key];
      subItems.push(
        <UserItem
          key={ 'subitem:' + sub._id }
          user={ sub }
          linkAction='startPM'
        />
      );
    }
    return subItems;
  },

  render() {
    return (
      <Modal show={ this.props.show } onHide={ this.hide } className='sub-modal'>
        <Modal.Header closeButton>
          <Modal.Title>
            Subscribers of "{ this.state.groupName }"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this._renderSubs() }
        </Modal.Body>
      </Modal>
    );
  }
});

module.exports = SubscriberModal;
