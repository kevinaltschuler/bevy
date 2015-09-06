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
  FlatButton,
  RaisedButton
} = require('material-ui');

var BevySettingsModal = require('./BevySettingsModal.jsx');
var BevyPanelHeader = require('./BevyPanelHeader.jsx');

var _ = require('underscore');
var constants = require('./../../constants');
var BevyActions = require('./../BevyActions');

var BevyPanel = React.createClass({

  propTypes: {
    activeBevy: React.PropTypes.object,
    myBevies: React.PropTypes.array.isRequired
  },

  getInitialState() {
    var joined = (_.findWhere(this.props.myBevies, { _id: this.props.activeBevy._id }) != undefined);
    return {
      joined: joined,
      showSettingsModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
    var joined = (_.findWhere(nextProps.myBevies, { _id: nextProps.activeBevy._id }) != undefined);
    this.setState({
      joined: joined
    });
  },

  onRequestJoin(ev) {
    ev.preventDefault();
    BevyActions.join(this.props.activeBevy._id, window.bootstrap.user._id, window.bootstrap.user.email);
    var bevy = this.props.bevy;
    this.setState({
      joined: true
    });
  },

  onRequestLeave(ev) {
    ev.preventDefault();
    BevyActions.leave(this.props.activeBevy._id);
    var bevy = this.props.bevy;
    this.setState({
      joined: false
    });
  },

  _renderBottomActions() {
    if(_.isEmpty(window.bootstrap.user)) return <div />;
    
    var joinButton = (this.state.joined)
    ? <FlatButton label='leave' onClick={ this.onRequestLeave } />
    : <RaisedButton label='join' onClick={ this.onRequestJoin } /> 

    if(_.findWhere(this.props.activeBevy.admins, { _id: window.bootstrap.user._id }) != undefined) {
      return (
        <div className='sidebar-bottom'>
          <FlatButton 
            label='Settings' 
            onClick={() => { this.setState({ showSettingsModal: true }); }}
          />
          <BevySettingsModal 
            activeBevy={ this.props.activeBevy } 
            show={ this.state.showSettingsModal }
            onHide={() => { this.setState({ showSettingsModal: false }); }}
          />
          { joinButton }
        </div>
      );
    } else {
      return (
        <div className='sidebar-bottom'>
          { joinButton }
        </div>
      );
    }
  },

  render() {
    return (
      <div className="bevy-panel panel">
        <BevyPanelHeader {...this.props}/>
        <div className='bevy-info'>
          <span className='member-count'>{ this.props.activeBevy.subCount } subscribers</span>
          <a href='#' className='admin-count'>{ this.props.activeBevy.admins.length } admins</a>
        </div>
        { this._renderBottomActions() }
      </div>
    );
  }
});

module.exports = BevyPanel;
