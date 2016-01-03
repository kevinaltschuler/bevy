/**
 * MyBevyPanel.jsx
 * formerly lesgo.jsx
 *
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
var BevyActions = require('./../BevyActions');
var user = window.bootstrap.user;

var MyBevyPanel = React.createClass({
  propTypes: {
    bevy: React.PropTypes.object,
  },

  getInitialState() {
    var bevy = this.props.bevy;
    return {
      name: bevy.name || '',
      description: bevy.description || '',
      image: bevy.image || {},
    };
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

  render() {
    var bevy = this.props.bevy;
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

    var subCount = (bevy.subCount == 1)
      ? '1 member'
      : bevy.subCount + ' members';
    var created = new Date(bevy.created).toLocaleDateString();

    var details = (
      <div className='left'>
        <span>{ subCount }</span>
        <span>Created on { created }</span>
      </div>
    );

    return (
      <div className="panel public-bevy-panel">
        <a
          className="bevy-panel-top"
          href={ this.props.bevy.url }
          style={ bevyImageStyle }
        />
        <div className='panel-info'>
          <div className='panel-info-top'>
            <a
              className='title'
              href={ this.props.bevy.url } >
              { name }
            </a>
            { this._renderLock() }
          </div>
          <div className='panel-info-bottom'>
            { details }
            <div className='right'>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = MyBevyPanel;
