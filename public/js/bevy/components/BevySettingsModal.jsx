/**
 * BevySettingsModal.jsx
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
var BevyActions = require('./../BevyActions');

var BevySettingsModal = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
  },

  getInitialState() {
    return {
      posts_expire_in: this.props.activeBevy.settings.posts_expire_in,
      privacy: this.props.activeBevy.settings.privacy
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

    this.setState({
      privacy: menuItem.text
    });
  },

  save(ev) {

    BevyActions.update(this.props.activeBevy._id, null, null, {
      privacy: this.state.privacy,
    });

    this.props.onHide();
  },

  destroyBevy(ev) {
    ev.preventDefault();
    if(!confirm('Are you sure? Deleting a bevy will also remove all content posted to that bevy, as well as chats within that bevy.')) return;

    BevyActions.destroy(this.props.activeBevy);
    this.props.onHide();
  },

  render() {

    var bevy = this.props.activeBevy;
    var settings = bevy.settings;

    var privacyMenuItems = [
      { payload: '0', text: 'Public', defaultIndex: 0 },
      { payload: '1', text: 'Private', defaultIndex: 1 }
    ];
    var privacyIndex = (this.state.privacy == 'Private')
    ? 1
    : 0;

    return (
      <Modal className="bevy-settings-modal" show={ this.props.show } onHide={ this.props.onHide } >
        <Modal.Header closeButton>
          <Modal.Title>
            Settings for <b>{this.props.activeBevy.name}</b>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className='bevy-setting expire-setting'>
            Privacy
            <OverlayTrigger placement='right' overlay={
              <Popover id='settingspopover' title='Bevy Privacy'>
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
              onClick={ this.destroyBevy }
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

module.exports = BevySettingsModal;
