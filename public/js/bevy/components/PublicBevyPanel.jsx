/**
 * BevyPanel.jsx
 * formerly RightSidebar.jsx
 *
 * @author albert
 * @author kevin
 */

'use strict';

var React = require('react');
var _ = require('underscore');

var router = require('./../../router');
var constants = require('./../../constants');

var {
  Button
} = require('react-bootstrap');
var {
  RaisedButton,
  FlatButton
} = require('material-ui');

var BevyActions = require('./../BevyActions');

var user = window.bootstrap.user;

var PublicBevyPanel = React.createClass({

  propTypes: {
    bevy: React.PropTypes.object,
    myBevies: React.PropTypes.array.isRequired
  },

  getInitialState() {

    var bevy = this.props.bevy;
    var joined = _.findWhere(this.props.myBevies, { _id: bevy._id }) != undefined;

    return {
      name: bevy.name || '',
      description: bevy.description || '',
      image_url: bevy.image_url || '',
      joined: joined
    };
  },

  onRequestJoin(ev) {
    ev.preventDefault();

    if(this.props.bevy.settings.privacy == 1) {
      BevyActions.requestJoin(this.props.bevy, window.bootstrap.user);
    } 
    else {
      BevyActions.join(this.props.bevy._id, window.bootstrap.user._id, window.bootstrap.user.email);

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

  switchBevy(ev) {
  },

  render() {

    var bevy = this.props.bevy;
    var bevyImage = (_.isEmpty(this.state.image_url)) ? '/img/default_group_img.png' : this.state.image_url;
    var bevyImageStyle = {backgroundImage: 'url(' + bevyImage + ')'};

    var name = (_.isEmpty(bevy)) ? 'not in a bevy' : this.state.name;
    var description = (_.isEmpty(bevy)) ? 'no description' : this.state.description;
    if(_.isEmpty(description)) description = 'no description';

    var joinButton = (this.state.joined)
    ? <FlatButton label='leave' onClick={ this.onRequestLeave } />
    : <RaisedButton disabled={_.isEmpty(window.bootstrap.user)} label='join' onClick={ this.onRequestJoin } /> 

    var requestButton = <RaisedButton disabled={_.isEmpty(window.bootstrap.user)} label='request' onClick={ this.onRequestJoin } />;

    var actionButton = (bevy.settings.privacy == 1 && !this.state.joined)
    ? requestButton
    : joinButton;

    var subCount = (bevy.subCount == 1) ? '1 member' : bevy.subCount + ' members';
    var created = new Date(bevy.created).toLocaleDateString();

    var details = (bevy.settings.privacy == 1 && !this.state.joined)
    ? (
        <div className='left'>
          <span>private</span>
          <span></span>
        </div>
      )
    : (
        <div className='left'>
          <span>{ subCount }</span>
          <span>created on { created }</span>
        </div>
      )

    return (
      <div className="panel public-bevy-panel">
        <a className="bevy-panel-top" href={ this.props.bevy.url } onClick={ this.switchBevy } style={ bevyImageStyle }/>
        <div className='panel-info'>
          <div className='panel-info-top'>
            <a className='title' href={ this.props.bevy.url } onClick={ this.switchBevy }>{ name }</a>
          </div>
          <div className='panel-info-bottom'>
            { details }
            <div className='right'>
              { actionButton }
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PublicBevyPanel;
