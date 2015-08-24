/**
 * EditParticipantsModal.jsx
 * @author albert
 */

'use strict';

var React = require('react');
var {
  Modal
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton
} = require('material-ui');

var _ = require('underscore');
var ChatStore = require('./../ChatStore');
var ChatActions = require('./../ChatActions');

var EditParticipantsModal = React.createClass({
  propTypes: {
    thread: React.PropTypes.object,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  _renderParticipants() {
    var users = [];
    var threadUsers = this.props.thread.users;
    threadUsers = _.reject(threadUsers, function($user) { return $user._id == window.bootstrap.user._id }); // skip self
    for(var key in threadUsers) {
      var participant = threadUsers[key];
      users.push(
        <ParticipantItem
          key={ 'participantitem:' + participant._id }
          thread={ this.props.thread }
          participant={ participant }
        />
      );
    }
    return users;
  },

  render() {

    return (
      <Modal className='edit-participants-modal' show={ this.props.show } onHide={ this.props.onHide }>
        <Modal.Header closeButton>
          <Modal.Title>Edit Participants</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className='participant-list'>
            { this._renderParticipants() }
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <FlatButton
            onClick={ this.props.onHide }
            label='Close'
            style={{marginRight: '0px', marginBottom: '0px'}} 
          />
        </Modal.Footer>
      </Modal>
    );
  }
});

var ParticipantItem = React.createClass({
  propTypes: {
    thread: React.PropTypes.object,
    participant: React.PropTypes.object
  },

  render() {
    var participant = this.props.participant;
    return (
      <li className='participant'>
        <div className='img' style={{
          backgroundImage: 'url(' + ((_.isEmpty(participant.image_url)) ? '/img/user-profile-icon.png' : participant.image_url) + ')'
        }} />
        <span className='name'>{ participant.displayName }</span>
        <FlatButton
          onClick={() => {
            ChatActions.removeUser(this.props.thread._id, participant._id);
          }}
          label='Remove'
          style={{
            
          }}
        />
      </li>
    );
  }
})

module.exports = EditParticipantsModal;