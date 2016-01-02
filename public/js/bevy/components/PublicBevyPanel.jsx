/**
 * BevyPanel.jsx
 * formerly RightSidebar.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var {
  Button,
  OverlayTrigger,
  Tooltip
} = require('react-bootstrap');
var {
  RaisedButton,
  FlatButton,
  Snackbar,
} = require('material-ui');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var BevyActions = require('./../BevyActions');
var user = window.bootstrap.user;

var PublicBevyPanel = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    myBevies: React.PropTypes.array.isRequired
  },

  getInitialState() {
    var bevy = this.props.bevy;

    return {
      name: bevy.name || '',
      description: bevy.description || '',
      image: bevy.image || {}
    };
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    if(this.props.bevy.settings.privacy == "Private") {
      BevyActions.requestJoin(this.props.bevy, window.bootstrap.user);
      this.refs.snackbar.show();
    }
    else {
      BevyActions.join(
        this.props.bevy._id,
        window.bootstrap.user._id,
        window.bootstrap.user.email
      );
      var joined = true;
      this.setState({
        joined: joined
      });
    }
  },

  onRequestLeave(ev) {
    ev.preventDefault();
    BevyActions.leave(this.props.bevy._id);
    var joined = false;
    this.setState({
      joined: joined
    });
  },


  _renderLock() {
    if(this.props.bevy.settings.privacy == 'Private') {
      return (
        <OverlayTrigger placement='top' overlay={
          <Tooltip id='privatetooltip'>This Bevy Is Private</Tooltip>
        }>
          <span className='glyphicon glyphicon-lock' />
        </OverlayTrigger>
      );
    } else {
      return (
        <OverlayTrigger placement='top' overlay={
          <Tooltip id='publictooltip'>This Bevy Is Public</Tooltip>
        }>
          <span className='glyphicon glyphicon-globe' />
        </OverlayTrigger>
      );
    }
  },

  render() {

    var bevy = this.props.bevy;
    var joined = _.findWhere(this.props.myBevies, { _id: bevy._id}) != undefined;
    if(this.props.bevy.settings.privacy == 'Private') {
      //return <div/>;
    }
    var bevyImage = (_.isEmpty(this.state.image))
      ? '/img/default_group_img.png'
      : this.state.image.path;
    var bevyImageStyle = { backgroundImage: 'url(' + bevyImage + ')' };

    var name = (_.isEmpty(bevy))
      ? 'not in a bevy'
      : this.state.name;
    var description = (_.isEmpty(bevy))
      ? 'no description'
      : this.state.description;
    if(_.isEmpty(description)) description = 'no description';

    var joinButton = (joined)
    ? <FlatButton label='leave' onClick={ this.onRequestLeave } />
    : (
      <RaisedButton
        disabled={_.isEmpty(window.bootstrap.user)}
        label='join'
        onClick={ this.onRequestJoin }
      />
    );

    var requestButton = (
      <div>
        <Snackbar
          message="Invitation Requested"
          autoHideDuration={5000}
          ref='snackbar'
        />
        <RaisedButton
          disabled={_.isEmpty(window.bootstrap.user)}
          label='request'
          onClick={ this.onRequestJoin }
        />
      </div>
    );

    var actionButton = (bevy.settings.privacy == 'Private' && !joined)
      ? requestButton
      : joinButton;

    var subCount = (bevy.subCount == 1)
      ? '1 member'
      : bevy.subCount + ' members';
    var created = new Date(bevy.created).toLocaleDateString();

    var loginTip = (_.isEmpty(window.bootstrap.user))
      ? <Tooltip>Please Login to Join</Tooltip>
      : <div/>;

    return (
      <div className="panel public-bevy-panel">
        <a
          className="bevy-panel-top"
          href={ this.props.bevy.url }
          onClick={ this.switchBevy }
          style={ bevyImageStyle }
        />
        <div className='panel-info'>
          <div className='panel-info-top'>
            <a
              className='title'
              href={ this.props.bevy.url }
              onClick={ this.switchBevy }
            >
              { name }
            </a>
            { this._renderLock() }
          </div>
          <div className='panel-info-bottom'>
            <div className='left'>
              <span>{ subCount }</span>
              <span>Created on { created }</span>
            </div>
            <div className='right'>
              <OverlayTrigger placement='bottom' overlay={loginTip}>
                { actionButton }
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PublicBevyPanel;
