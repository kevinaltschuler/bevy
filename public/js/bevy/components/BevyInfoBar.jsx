/**
 * BevyInfoBar.jsx
 * @author kevin
 * @author albert
 * @flow
 */

'use strict';

var React = require('react');
var {
  Button,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');

var {
  IconButton
} = require('material-ui');

var _ = require('underscore');
var BevySettingsModal = require('./BevySettingsModal.jsx');

var BevyInfoBar = React.createClass({
  propTypes: {
    activeBevy: React.PropTypes.object
  },

  getInitialState() {
    return {
      showSettingsModal: false
    }
  },

  render() {
    var bevy = this.props.activeBevy;
    if(_.isEmpty(bevy)) {
        console.log('shit');
        return <div/>;
    }
    var publicPrivate = (bevy.settings.privacy == 'Private')
    ?  (
        <OverlayTrigger placement='bottom' overlay={<Tooltip>Private</Tooltip>}>
          <i className="material-icons">lock</i>
        </OverlayTrigger>
      )
    : (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>Public</Tooltip>}>
        <i className="material-icons">public</i>
      </OverlayTrigger>
    );

    var subs = (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>{bevy.subCount + " subscribers"}</Tooltip>}>
        <i className="material-icons">people</i>
      </OverlayTrigger>
    );

    var admins = (
      <OverlayTrigger placement='bottom' overlay={<Tooltip>{ bevy.admins.length }&nbsp;{ (bevy.admins.length == 1) ? 'admin' : 'admins' }</Tooltip>}>
      <i className="material-icons">person</i>
      </OverlayTrigger>
    );

    var settings = (
      <IconButton onClick={() => this.setState({showSettingsModal: true})} style={{height: 30, width: 24, padding: 0, marginTop: -2, textShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)'}}>
        <i className="material-icons">settings</i>
      </IconButton>
    );

    return (
      <div className='bevy-info-bar'>
        <div className='info-item'>
            {publicPrivate}
        </div>
        <div className='info-item'>
            {subs}
        </div>
        <div className='info-item'>
            {admins}
        </div>
        <div className='info-item'>
            {settings}
        </div>
        <BevySettingsModal
          show={this.state.showSettingsModal}
          onHide={() => this.setState({showSettingsModal: false})}
          activeBevy={bevy}
        />
      </div>
    );
  }
});

module.exports = BevyInfoBar;
