/**
 * BoardSettingsModal.jsx
 *
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Modal,
  OverlayTrigger,
  Popover
} = require('react-bootstrap');
var {
  FlatButton,
  RaisedButton,
  Toggle,
  DropDownMenu
} = require('material-ui');

var _ = require('underscore');
var BoardActions = require('./../BoardActions');

var BoardSettingsModal = React.createClass({

  propTypes: {
    board: React.PropTypes.object,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      posts_expire_in: this.props.board.settings.posts_expire_in,
      privacy: this.props.board.settings.privacy
    };
  },

  onDropDownChange(ev, selectedIndex, menuItem) {
    ev.preventDefault();

    this.setState({
      posts_expire_in: menuItem.payload
    });
  },

  onPrivacyChange(ev, selectedIndex, menuItem) {
    ev.preventDefault();

    console.log(menuItem);

    this.setState({
      privacy: menuItem.text
    });
  },

  save(ev) {
    //var anonymise_users = this.refs.anonymise_users.isToggled();
    var group_chat = this.refs.group_chat.isToggled();
    var admin_only = this.refs.admin_only.isToggled();

    BoardActions.update(this.props.board._id, null, null, null, {
      group_chat: group_chat,
      admin_only: admin_only,
      privacy: this.state.privacy,
    });

    this.props.onHide();
  },

  destroyBoard(ev) {
    ev.preventDefault();
    if(!confirm('Are you sure? Deleting a board will also remove all content posted to that bevy.')) return;

    BoardActions.destroy(this.props.board._id);
    this.props.onHide();
  },

  render() {

    var board = this.props.board;
    var settings = board.settings;

    var privacyMenuItems = [
      { payload: '0', text: 'Public', defaultIndex: 0 },
      { payload: '1', text: 'Private', defaultIndex: 1 }
    ];
    var privacyIndex = (this.state.privacy == 'Private')
    ? 1
    : 0;

    var posts_expire_in = this.state.posts_expire_in;

    return (
      <Modal className="bevy-settings-modal" show={ this.props.show } onHide={ this.props.onHide } >
        <Modal.Header closeButton>
          <Modal.Title>
            Settings for <b>{this.props.board.name}</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/*<div className='bevy-setting expire-setting'>
            Privacy
            <OverlayTrigger placement='right' overlay={ 
              <Popover title='Bevy Privacy'>
                <p className='warning'>
                  Public bevies can be viewed and joined by anybody. <br /><br />
                  Private bevies are listed publicly but require an invite or permission to join and view content.
                </p>
              </Popover> 
            }>
              <span className='glyphicon glyphicon-question-sign' />
            </OverlayTrigger>
            <DropDownMenu
              ref='privacy'
              menuItems={ privacyMenuItems }
              onChange={ this.onPrivacyChange }
              selectedIndex={ privacyIndex }
            />
          </div>*/}
          <div className='bevy-setting'>
            <Toggle
              label="Show Group Chat"
              defaultToggled={ settings.group_chat }
              ref='group_chat'
            />
          </div>
          <div className='bevy-setting'>
            <RaisedButton 
              label='Delete Bevy'
              backgroundColor='#d9534f'
              labelColor='#fff'
              style={{
                backgroundColor: '#d9534f',
                width: '100%'
              }}
              labelStyle={{
                color: '#fff',
                fontWeight: 'bold'
              }}
              onClick={ this.destroyBoard }
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <FlatButton
            onClick={ this.props.onHide }
            label='Cancel'
          />
          <div style={{ flexGrow: 1 }} />
          <RaisedButton
            onClick={ this.save }
            label='Save' />
        </Modal.Footer>
      </Modal>
    );
  }
});

module.exports = BoardSettingsModal;
