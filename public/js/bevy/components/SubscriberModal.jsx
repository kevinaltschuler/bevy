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

var _ = require('underscore');
var constants = require('./../../constants');
var ChatActions = require('./../../chat/ChatActions');

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
    if(!_.isEmpty(window.bootstrap.user))
      if(!(id == window.bootstrap.user._id))
        ChatActions.startPM(id);
  },

  _renderSubs() {
    var subs = this.state.subs;
    var subItems = [];
    for(var key in subs) {
      var sub = subs[key];
      var image_url = (_.isEmpty(sub.image))
        ? constants.defaultProfileImage
        : sub.image.path;
      subItems.push(
        <div
          key={ 'subitem:' + key }
          className='sub-item'
          onClick={() => this.startPM(sub._id)}
        >
          <div className='img' style={{
            backgroundImage: 'url(' + image_url + ')'
          }} />
          <span className='name'>
            { sub.displayName }
          </span>
        </div>
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
