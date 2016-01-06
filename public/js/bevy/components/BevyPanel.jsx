/**
 * BevyPanel.jsx
 * @author albert
 * @author kevin
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
  RaisedButton,
  FlatButton,
  Snackbar,
} = require('material-ui');

var _ = require('underscore');
var router = require('./../../router');
var constants = require('./../../constants');
var resizeImage = require('./../../shared/helpers/resizeImage');
var BevyActions = require('./../BevyActions');
var user = window.bootstrap.user;

var BevyPanel = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
    myBevies: React.PropTypes.array,
    showActionButton: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      showActionButton: false
    };
  },

  getInitialState() {
    return {
      name: this.props.bevy.name,
      description: this.props.bevy.description || 'No Description',
      image: this.props.bevy.image || {},
      joined: (_.findWhere(this.props.myBevies, { _id: this.props.bevy._id}) != undefined)
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      joined: (_.findWhere(nextProps.myBevies, { _id: nextProps.bevy._id}) != undefined)
    });
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    if(this.props.bevy.settings.privacy == "Private") {
      BevyActions.requestJoin(this.props.bevy, window.bootstrap.user);
      this.refs.snackbar.show();
    }
    else {
      BevyActions.join(this.props.bevy);
      this.setState({
        joined: true
      });
    }
  },

  onRequestLeave(ev) {
    ev.preventDefault();
    BevyActions.leave(this.props.bevy);
    this.setState({
      joined: false
    });
  },

  _renderLock() {
    return (
      <div className='privacy-info'>
        <span className={ 'glyphicon ' + ((this.props.bevy.settings.privacy == 'Public')
          ? 'glyphicon-globe'
          : 'glyphicon-lock') }
        />
        <span className='privacy-desc'>
          {(this.props.bevy.settings.privacy == 'Public')
            ? 'Public'
            : 'Private'}
        </span>
      </div>
    );
  },

  _renderActionButton() {
    if(!this.props.showActionButton) return <div />;
    var joinButton = (this.state.joined)
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
          autoHideDuration={ 5000 }
          ref='snackbar'
        />
        <RaisedButton
          disabled={_.isEmpty(window.bootstrap.user)}
          label='request'
          onClick={ this.onRequestJoin }
        />
      </div>
    );

    return ((this.props.bevy.settings.privacy == 'Private' && !this.state.joined)
      ? requestButton
      : joinButton);
  },

  render() {
    var bevyImageURL = (_.isEmpty(this.state.image))
      ? '/img/default_group_img.png'
      : resizeImage(this.state.image, 400, 200).url;

    return (
      <div className="panel bevy-panel">
        <a
          className="bevy-panel-top"
          title={ this.props.bevy.name }
          href={ this.props.bevy.url }
          style={{ backgroundImage: 'url(' + bevyImageURL + ')' }}
        />
        <div className='panel-info'>
          <div className='panel-info-top'>
            <a
              className='title'
              title={ this.state.name }
              href={ this.props.bevy.url } >
              { this.state.name }
            </a>
            { this._renderLock() }
          </div>
          <div className='panel-info-bottom'>
            <div className='left'>
              <span>
                {((this.props.bevy.subCount == 1)
                  ? '1 member'
                  : this.props.bevy.subCount + ' members')}
              </span>
              <span>
                Created on&nbsp;
                { new Date(this.props.bevy.created).toLocaleDateString() }
              </span>
            </div>
            <div className='right'>
              { this._renderActionButton() }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = BevyPanel;
